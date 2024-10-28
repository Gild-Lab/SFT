<script>
    import {
        account,
        ethersData,
        sftInfo, transactionError,
        transactionInProgress,
        transactionSuccess,
        activeNetwork
    } from "../scripts/store";
    import {
        cborDecode,
        getContract, showPrompt,
    } from "../scripts/helpers.js";
    import SftLoader from '../components/SftLoader.svelte';
    import {icons} from '../scripts/assets.js';
    import {encodeAddresses, hexToBytes, initWasm} from "../wasm_utils.js";
    import {
        MAGIC_NUMBERS, RAIN_METADATA_CONTRACT_ADDRESS_ARBITRUM_ONE
    } from '../scripts/consts.js';
    import {arrayify} from 'ethers/lib/utils.js';
    import metadataContractAbi from "../contract/rainMetadata/rainMetadataAbi.json"
    import {onMount} from 'svelte';
    import networks from '../scripts/networksConfig.js';
    import {ethers} from 'ethers';

    let {signer} = $ethersData;
    let arbitrumNet = networks.find(n => n.id === 42161)

    let metadataContract = "";
    let addresses = [];

    onMount(async () => {
        metadataContract = await getContract(arbitrumNet, RAIN_METADATA_CONTRACT_ADDRESS_ARBITRUM_ONE.trim(), metadataContractAbi, $ethersData.signerOrProvider)
        await getAddresses();
    })

    function processAddresses(metaData) {
        const addressActions = {};
        // Traverse the meta data to process each add/remove action
        metaData.forEach(item => {
            const decoded = cborDecode(item.meta.slice(18)); // Decode the meta data
            const myArray = decoded[0].get(0);
            const magicNumber = decoded[0].get(1);
            if (magicNumber && magicNumber === MAGIC_NUMBERS.AUTHORS_LIST) {
                const actionPrefix = myArray[0];
                if (myArray instanceof Uint8Array) {
                    const addressHex = arrayToHex(myArray.subarray(1)); // Extract the address

                    // Track the last action for each address (1 for add, 0 for remove) along with the sender
                    addressActions[addressHex] = {action: actionPrefix, sender: item.sender};
                }
            }
        });

        // Collect addresses that were added (1) and not subsequently removed (0)
        return Object.keys(addressActions)
            .filter(address => addressActions[address].action === 1)
            .map(address => ({
                address: address,
                sender: addressActions[address].sender
            }));
    }


    // Helper function to convert Uint8Array to a hex string
    function arrayToHex(uint8Array) {
        return '0x' + Array.from(uint8Array)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    async function cborEncodeAddress(addresses) {
        await initWasm();
        return await encodeAddresses(addresses);
    }

    async function getAddresses() {
        const managerAddress = import.meta.env.VITE_MANAGER_ADDRESS;
        const addresses_subgraph_url = import.meta.env.VITE_ADDRESSES_SUBGRAPH_URL;

        let query = `
          query($sender: String!) {
            metaV1S(where: { sender: $sender }) {
              meta
              sender
            }
          }
         `;

        let data = {};
        let variables = {sender: managerAddress.toLowerCase()}
        try {
            let req = await fetch(addresses_subgraph_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            })

            data = await req.json()

            if (data) {
                let tempData = data.data;

                if (tempData.metaV1S?.length > 0) {
                    addresses = processAddresses(tempData.metaV1S);
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    let error = ''
    let addressFound = false;
    let loading = false;
    let address = '';
    $: address && checkAddress();

    function checkAddress() {
        if (address) {
            addressFound = !!addresses.find(a => a.address === address)
        }
    }

    async function switchToArbitrum() {
        let arbNetChainId = ethers.utils.hexValue(arbitrumNet.chainId)

        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: arbNetChainId}]
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: arbNetChainId,
                                chainName: arbitrumNet.displayName,
                                rpcUrls: [arbitrumNet.rpcUrl],
                                blockExplorerUrls: [arbitrumNet.blockExplorer],
                                nativeCurrency: {
                                    name: arbitrumNet.currencySymbol,
                                    symbol: arbitrumNet.currencySymbol,
                                    decimals: 18
                                }
                            }
                        ]
                    });
                } catch (addError) {
                    console.log(addError)
                }
            }
        }
    }

    async function addAddress() {

        if (addressFound) {
            return;
        }
        let byteAddress = await hexToBytes(address)

        // Create a new Uint8Array with a length of 21 bytes
        let newArray = new Uint8Array(21);

        // Set the first byte of the new array to 1
        newArray[0] = 1;

        // Copy the contents of the original array to the new array starting from index 1
        newArray.set(byteAddress, 1);

        //Cbor Encode the address
        let cborEncoded = await cborEncodeAddress(newArray)

        let rainMagic = arrayify(MAGIC_NUMBERS.RAIN_META_DOCUMENT_HEX_STRING)

        let constructedMeta = new Uint8Array(rainMagic.length + cborEncoded.length);

        constructedMeta.set(rainMagic, 0);
        constructedMeta.set(cborEncoded, rainMagic.length);
        let subject = "0x0000000000000000000000000000000000000000000000000000000000000001"
        let tx = await metadataContract.connect(signer)["emitMeta(bytes32,bytes)"](subject, constructedMeta);
        await showPrompt(tx)

        let wait = await tx.wait()
        if (wait.status === 1) {
            addresses = [...addresses, {address: address, sender: $account}];
            transactionSuccess.set(true)
            transactionInProgress.set(false)
        } else {
            transactionError.set(true)
        }

    }

    function copyAddress(address) {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(address.toLowerCase());
        }
        return Promise.reject("The Clipboard API is not available.");
    }

    async function removeAddress(address) {
        let byteAddress = await hexToBytes(address)
        // Create a new Uint8Array with a length of 21 bytes
        let newArray = new Uint8Array(21);

        // Set the first byte of the new array to 0
        newArray[0] = 0;

        // Copy the contents of the original array to the new array starting from index 1
        newArray.set(byteAddress, 1);

        //Cbor Encode the address
        let cborEncoded = await cborEncodeAddress(newArray)

        let rainMagic = arrayify(MAGIC_NUMBERS.RAIN_META_DOCUMENT_HEX_STRING)

        let constructedMeta = new Uint8Array(rainMagic.length + cborEncoded.length);

        constructedMeta.set(rainMagic, 0);
        constructedMeta.set(cborEncoded, rainMagic.length);
        const tx = await metadataContract.connect(signer)["emitMeta(uint256,bytes)"](1, constructedMeta);
        let wait = await tx.wait()
        if (wait.status === 1) {
            addresses = addresses.filter(a => a.address !== address);
            transactionSuccess.set(true)
            transactionInProgress.set(false)
        } else {
            transactionError.set(true)
        }
    }
</script>

<div class="{$sftInfo ? 'w-full' : 'left-margin'} mr-5">
  {#if loading}
    <SftLoader/>
  {/if}
  {#if !loading }
    <div class="bg-white rounded-xl gap-4 flex flex-col p-8">
      <div class="flex flex-col items-start gap-2 w-full font-normal">
        <span>Add an address to track IPFS pins from</span>
        <div class="flex gap-5 w-full">
          <input class="default-input w-1/2" bind:value={address}/>
          {#if $activeNetwork.chainId === arbitrumNet.chainId}
            <button class="default-btn" on:click={()=>{addAddress()}} disabled={addressFound}> Add address</button>
          {/if}
          {#if $activeNetwork.chainId !== arbitrumNet.chainId}
            <button class="default-btn" on:click={()=>{switchToArbitrum()}}> Change network</button>
          {/if}
          {#if addressFound}
            <div class="error">Address already added</div>
          {/if}
        </div>
      </div>
      <span class="self-start">Current Addresses to track IPFS pins from</span>
      <table class="sft-table shadow-none">
        <thead>
        <tr>
          <th></th>
          <th>Current addresses</th>
          <th class="rounded-tr-[10px]">Sender</th>
          <th class="!bg-white"></th>
        </tr>
        </thead>
        <tbody>
        {#if addresses.length}

          {#each addresses as ad}
            <tr class="tb-row">
              <td class="cursor-pointer hover:opacity-50" on:click={()=>{copyAddress(ad.address)}}>
                <img class="ml-5" src="{icons.copy_brown}" alt="copy">
              </td>
              <td class="address flex">{ad?.address?.toLowerCase()}</td>
              <td>{ad?.sender?.toLowerCase()}</td>
              <td class="bg-white border-0" on:click={()=>{removeAddress(ad.address)}}>
                <img class="ml-2 cursor-pointer hover:opacity-50" src="{icons.bin}" alt="copy">
              </td>
            </tr>
          {/each}
        {/if}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
    .left-margin {
        margin-left: 223px;
    }

    .address {
        color: #9D7334;
    }


</style>