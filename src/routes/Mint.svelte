<script>
    import {ethers} from "ethers";
    import {
        vault,
        fileHash,
        fileDropped,
        uploadBtnLoading,
        activeNetwork,
        schemas,
        transactionError,
        transactionSuccess,
        transactionInProgress,
        auditHistory,
        tokenName,
        pageTitle,
        isCypress
    } from "../scripts/store.js";
    import {account} from "../scripts/store.js";
    import axios from "axios";
    import Select from "../components/Select.svelte";
    import {icons} from "../scripts/assets.js";
    import {
        IPFS_APIS,
        MAGIC_NUMBERS,
        ONE,
    } from "../scripts/consts.js";
    import {
        bytesToMeta,
        cborDecode,
        cborEncode,
        encodeCBORStructure,
        getIpfsGetWay,
        getSubgraphData,
        hasRole, showPromptSFTCreate,
    } from "../scripts/helpers";
    import jQuery from 'jquery';
    import {beforeUpdate, onMount} from "svelte";
    import {
        AUDIT_HISTORY_DATA_QUERY,
        DEPOSITS_QUERY,
        VAULT_INFORMATION_QUERY
    } from "../scripts/queries.js";
    import {arrayify} from "ethers/lib/utils.js";
    import {navigate} from '../scripts/helpers.js';
    import MintInput from '../components/MintInput.svelte';
    import Schema from '../components/Schema.svelte';
    import Connect from '../components/Connect.svelte';
    import IpfsLogin from '../components/IpfsLogin.svelte';

    let image = {}

    let error = ""
    let ipfsLoading = false;

    let loveToSchemas = [
        {
            "displayName": 'Love To',
            "schema": {
                "type": "object",
                "required": [
                    "name",
                    "wallet",
                    "title"
                ],
                "properties": {
                    "name": {
                        "type": "string",
                        "title": "Name"
                    },
                    "wallet": {
                        "type": "string",
                        "title": "Wallet"
                    },
                    "title": {
                        "type": "string",
                        "title": "Title"
                    }
                }
            }
        }
    ]

    let selectedSchema = {}
    export let ethersData;
    let {signer} = ethersData;

    let amount;
    let shouldDisable = !$schemas.length
    let username = "";
    let password = "";
    let promise;
    let fileHashes = [];

    beforeUpdate(() => {
        fileDropped.set({})
    })

    onMount(async () => {
        await getSchemas()
    })

    async function getSchemas() {
        let variables = {id: $vault?.address?.toLowerCase()}
        if ($vault.address) {
            try {
                let resp = await getSubgraphData($activeNetwork, variables, VAULT_INFORMATION_QUERY, 'offchainAssetReceiptVault')
                let receiptVaultInformations = ""
                let tempSchema = []

                if (resp && resp.data && resp.data.offchainAssetReceiptVault) {
                    ipfsLoading = true
                    receiptVaultInformations = resp.data.offchainAssetReceiptVault.receiptVaultInformations

                    if (receiptVaultInformations.length) {
                        receiptVaultInformations.map(async data => {
                            let cborDecodedInformation = cborDecode(data.information.slice(18))
                            if (cborDecodedInformation[0].get(1) === MAGIC_NUMBERS.OA_SCHEMA) {
                                let schemaHash = cborDecodedInformation[1].get(0)
                                if (schemaHash && !schemaHash.includes(',')) {
                                    let structure = bytesToMeta(cborDecodedInformation[0].get(0), "json")
                                    tempSchema = [...tempSchema, {
                                        ...structure,
                                        timestamp: receiptVaultInformations[0].timestamp,
                                        id: receiptVaultInformations[0].id,
                                        hash: schemaHash,
                                    }]
                                    tempSchema = tempSchema.filter(d => d.displayName && d.hash)
                                    schemas.set(tempSchema)
                                    ipfsLoading = false;
                                }
                            }

                        })
                    }
                }

            } catch (err) {
                console.log(err)
            }
        }
    }

    async function mint() {

        if ($isCypress) {
            let tx = {
                hash: "0x74e6434511672cce3d94b332b0e44a3744bfef4382bf1c989577ed6d29bfabc4"
            }
            await showPromptSFTCreate(tx, {errorText: "Mint failed", successText: "Mint successful!"})

            setTimeout(() => {
                transactionSuccess.set(true)
                transactionInProgress.set(false)
            }, 3000);

            return
        }

        try {
            error = ""

            if (!parseFloat(amount)) {
                error = "Zero amount"
                return;
            }

            const hasRoleDepositor = $isCypress ? true : await hasRole($vault, $account, "DEPOSITOR")

            if (!hasRoleDepositor.error) {
                let structure = await submitForm()
                if (structure) {
                    let fileHashesList = fileHashes.map(f => f.hash)
                    let encodedStructure = encodeCBORStructure(structure, selectedSchema.hash)

                    let shareRatio = ONE
                    const shares = ethers.utils.parseEther(amount.toString());

                    try {
                        let structureIpfs = await upload(structure)
                        if (!structureIpfs.Hash) {
                            return
                        }
                        let encodedHashList = cborEncode([...fileHashesList,
                            structureIpfs?.Hash].toString(), MAGIC_NUMBERS.OA_HASH_LIST)
                        const meta = "0x" + MAGIC_NUMBERS.RAIN_META_DOCUMENT.toString(16).toLowerCase() +
                            encodedStructure + encodedHashList
                        const tx = await $vault
                            .connect(signer)
                            ["mint(uint256,address,uint256,bytes)"](shares, $account, shareRatio, arrayify(meta));
                        await showPromptSFTCreate(tx, {errorText: "Mint failed", successText: "Mint successful!"})

                        let wait = await tx.wait()
                        if (wait.status === 1) {
                            let interval = setInterval(async () => {
                                let deposits = await getSubgraphData($activeNetwork, {id: $vault.address.toLowerCase()}, DEPOSITS_QUERY, 'offchainAssetReceiptVault')
                                deposits = deposits?.data?.offchainAssetReceiptVault.deposits

                                if (deposits && deposits.length) {
                                    if (wait.blockNumber.toString() === deposits[0].transaction.blockNumber) {
                                        let data = await getSubgraphData($activeNetwork, {id: $vault.address.toLowerCase()}, AUDIT_HISTORY_DATA_QUERY, 'offchainAssetReceiptVault')
                                        if (auditHistory) {
                                            let temp = data.data.offchainAssetReceiptVault
                                            auditHistory.set(temp)
                                        } else {
                                            auditHistory.set({})
                                        }
                                        transactionSuccess.set(true)
                                        transactionInProgress.set(false)
                                        clearInterval(interval)
                                        amount = 0;
                                    }
                                }
                            }, 2000)
                        } else {
                            transactionError.set(true)
                        }
                        fileDropped.set({})
                    } catch (err) {
                        console.log(err)
                    }
                }
            } else {
                error = hasRoleDepositor.error
            }

        } catch (er) {
            error = "Something Went Wrong"
            console.log(er.reason || er.message || er)
        }
        shouldDisable = false;
    }


    const upload = async (data, type) => {
        error = ""
        uploadBtnLoading.set(true)

        username = localStorage.getItem('ipfsUsername');
        password = localStorage.getItem('ipfsPassword');

        let formData = new FormData();

        type === "file" ? formData.append('file', data.file) : formData.append('file', data)

        const requestArr = IPFS_APIS.map((url) => {
            return axios.request({
                url,
                auth: {
                    username,
                    password
                },
                method: 'post',
                headers: {
                    "Content-Type": `multipart/form-data;`,
                },
                data: formData,
                onUploadProgress: ((p) => {
                    console.log(`Uploading...  ${p.loaded} / ${p.total}`);
                }),
                withCredentials: true,
            })
        });

        let respAll = await Promise.allSettled(requestArr)

        respAll.map(response => {
            if (response.status === "rejected") {
                reportError(response.reason)
            } else return response
        })

        let resolvedPromise = respAll.find(r => r.status === "fulfilled")
        if (resolvedPromise) {
            if (type === "file" && data.file.size) {
                fileHashes = [...fileHashes, {prop: data.prop, hash: resolvedPromise.value.data.Hash}]//.set(resolvedPromise.value.data.Hash)
            }
        } else {
            error = "Something went wrong"
        }
        uploadBtnLoading.set(false)
        username = ""
        password = ""
        return resolvedPromise?.value.data
    };

    $: $activeNetwork.chainId && getSchemas()

    // $: $fileHash && getCertificateUrl($fileHash);

    async function handleSchemaSelect(event) {
        selectedSchema = event.detail.selected
        const form = document.querySelector('.svelte-schema-form'); // select the form element
        if (form) {
            form.reset();
        }
    }

    let certificateUrl = ''

    async function getCertificateUrl() {
        certificateUrl = await getIpfsGetWay($fileHash)
    }

    async function submitForm() {
        //get form data
        let formDataArr = jQuery(".svelte-schema-form").serializeArray()
        const json = {};
        formDataArr.map(a => {
            json[a.name] = a.value
        })
        if (fileHashes.length) {
            fileHashes.map(data => {
                json[data.prop] = data.hash
            })
        }
        let formFields = Object.keys(json)

        let formNotEmpty = formFields.some(f => json[f] !== "")
        let response = null;
        if (formNotEmpty) {
            response = JSON.stringify(json)
        }

        return response
    }

    pageTitle.set("Mint/Redeem")

    function handleFileUpload(event) {
        fileHashes = event.detail.fileHashes
    }

    let loggedIn = localStorage.getItem('ipfsPassword') || localStorage.getItem('ipfsUsername');
</script>

<div class="mint-container relative">
  <div class="header-buttons">
    <button type="button" class="default-btn new-asset-class" on:click={()=>{navigate('#new-asset-class')}}>
      New asset class
    </button>
    <button type="button" class="default-btn asset-class-list" disabled={!$schemas.length}
            on:click={()=>{navigate('#asset-classes')}}>
      Asset class list
    </button>
    <button class="default-btn audit-history" on:click={()=>{navigate('#audit-history')}}>
      Audit history
    </button>
  </div>


  {#if !loggedIn || !$account}
    <div class="flex flex-col gap-5 w-full">

      <span class="font-bold w-full text-left ml-6"> {$tokenName}</span>
      <div class="border flex items-center p-5 steps"><span>2 things to do before minting - You need to connect a wallet so you can send transactions
      to the blockchain and you need a data storage (Currently using IPFS, Holochain coming soon).</span>
      </div>

      {#if !loggedIn}
        <IpfsLogin on:success={()=>{loggedIn = true}}/>
      {/if}

      {#if !$account}
        <div class="border flex items-center">
          <Connect action="mint" className="pt-5 pb-5"></Connect>
        </div>
      {/if}

    </div>
  {:else}
    <div class="audit-info-container basic-frame-parent">
      <div class="form-frame basic-frame">
        <label class="f-weight-700 text-center mb-3">{$tokenName || ""}</label>
        <MintInput bind:amount={amount} amountLabel={"Mint amount"} id="mint-amount"
                   info="(Mint amount = number of tokens that will go into your wallet)"/>
        {#if $schemas.length}
          <div class="schema">
            <div class="schema-dropdown flex justify-between mb-6">
              <label class="f-weight-700 custom-col">Asset class</label>
              <Select options={$schemas}

                      on:select={handleSchemaSelect}
                      label={'Choose'} className={"mintSelect"} expandIcon={icons.expand_black}></Select>

            </div>
            <Schema schema={selectedSchema} on:fileUpload={handleFileUpload}></Schema>
          </div>
        {/if}
        {#if !$schemas.length}
          <div class="empty-schemas">
            <span>Please create a new asset class to mint </span>
          </div>
        {/if}
      </div>

    </div>

    <div class="error">{error}</div>
    <div class="info-text f-weight-700">After minting an amount you receive 2 things: ERC1155 token (NFT) and an ERC20
      (FT)
    </div>

    <button class="mint-btn btn-solid" on:click={() => mint()}
            disabled="{!selectedSchema.hash || !parseFloat(amount)}">
      Mint
    </button>

  {/if}


</div>

<style>
    .mint-container {
        padding-top: 17px;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }

    .header-buttons {
        margin-bottom: 5px;
        width: 100%;
        justify-content: right;
        padding: 0 12px 0 12px;
    }

    .form-frame {
        padding: 20px;
        display: flex;
        text-align: left;
        flex-direction: column;
        font-weight: 400;
        font-size: 16px;
        line-height: 27px;
        min-height: 325px;
    }

    .info-text {
        font-size: 12px;
        line-height: 20px;
    }

    .mint-btn {
        width: 413px;
        margin-top: 30px;
    }

    .empty-schemas button {
        margin-top: 5px;
    }

    .schema table {
        width: 100%;
    }

    .schema table td:nth-child(2) {
        text-align: right;
    }

    .custom-col {
        margin-right: 25px;
    }

    .empty-schemas {
        color: #DD1212;
        text-align: center;
    }

    .schema-dropdown {
        margin-top: 20px;
        align-items: center;
    }

    .border {
        border: 1px solid #D2D2D2;
        margin-left: 1.5rem;
        margin-right: 1.5rem;
        border-radius: 10px;
        width: calc(100% - 3rem);
    }

    .steps {
        color: #000;

        font-family: "Mukta", sans-serif;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
</style>

