<script>
    import SftLoader from "../components/SftLoader.svelte";

    import {
        account,
        accountRoles,
        activeNetwork, auditHistory,
        ethersData, roles, schemas,
        sftInfo,
        tokens, tokensLoading, transactionError, transactionInProgress, transactionInProgressShow, transactionSuccess,
        vault
    } from "../scripts/store.js";
    import {IPFS_APIS, MAGIC_NUMBERS} from '../scripts/consts.js';
    import axios from 'axios';
    import {
        cborEncode,
        encodeCBOR, getContract,
        getSubgraphData, navigate, setAccountRoles,
        showPrompt,
        showPromptSFTCreate
    } from '../scripts/helpers.js';
    import {arrayify} from 'ethers/lib/utils.js';
    import {
        AUDIT_HISTORY_DATA_QUERY,
        RECEIPT_VAULT_INFORMATION_QUERY,
        VAULT_INFORMATION_QUERY,
        VAULTS_QUERY
    } from '../scripts/queries.js';
    import contractAbi from '../contract/OffchainAssetVaultAbi.json';
    import {icons} from '../scripts/assets.js';
    import TileView from '../components/TileView.svelte';
    import ListView from '../components/ListView.svelte';
    import {onMount} from 'svelte';
    import {mock} from '../test/mock.js';

    let username;
    let password;
    let view = "tile";
    let searchText = "";
    let credentialLinks = {}
    let computedTokens = []
    let loading = false

    $: $tokens.length && setComputedTokens()

    onMount(() => {
            if (!!window.Cypress) {
                tokens.set(mock.testTokens);
            }
        }
    )

    function setComputedTokens() {
        computedTokens = $tokens
    }

    $: {
        searchText;
        searchToken()
    }

    async function deployImage(event) {
        let file = event.detail.file
        let vault = await getContract($activeNetwork, event.detail.vault.address, contractAbi, $ethersData.signerOrProvider)
        try {
            try {
                let uploadResult = await upload(file)

                let fileHash = {
                    hash: uploadResult.Hash.toString()
                }

                let encodedFile = encodeCBOR(fileHash, MAGIC_NUMBERS.OA_TOKEN_IMAGE)

                let encodedHashList = cborEncode(
                    [uploadResult?.Hash].toString(),
                    MAGIC_NUMBERS.OA_HASH_LIST
                );
                const meta = "0x" + MAGIC_NUMBERS.RAIN_META_DOCUMENT.toString(16).toLowerCase() + encodedFile +
                    encodedHashList

                let transaction = await vault.connect($ethersData.signer).receiptVaultInformation(arrayify(meta))
                await showPromptSFTCreate(transaction)

                let wait = await transaction.wait()
                if (wait.status === 1) {
                    let interval = setInterval(async () => {
                        let informationResp = await getSubgraphData($activeNetwork, {}, RECEIPT_VAULT_INFORMATION_QUERY, 'receiptVaultInformations')
                        informationResp = informationResp?.data?.receiptVaultInformations
                        if (informationResp && informationResp.length) {
                            if (wait.blockNumber.toString() === informationResp[0].transaction.blockNumber) {
                                // schemas.set(await getSchemas($activeNetwork, $vault, $deposits))
                                transactionSuccess.set(true)
                                transactionInProgress.set(false)
                                clearInterval(interval)
                                //set image
                                await getTokens()
                            }
                        }
                    }, 2000)

                } else {
                    transactionError.set(true)
                }

            } catch (err) {
                console.log(err)
            }
        } catch (e) {
            console.log(e.message)
        }

    }

    const upload = async (data) => {
        let savedUsername = localStorage.getItem('ipfsUsername');
        let savedPassword = localStorage.getItem('ipfsPassword');
        if (!savedPassword || !savedUsername) {
            navigate("#ipfs");
        } else {
            username = savedUsername;
            password = savedPassword

            let formData = new FormData();

            formData.append('file', data)

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
                    onUploadProgress: (async (p) => {
                        await showPrompt(null, {topText: "Uploading to IPFS, please wait", noBottomText: true})
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

                localStorage.setItem('ipfsUsername', username);
                localStorage.setItem('ipfsPassword', password);

            } else {
                console.log("Something went wrong")
            }
            username = ""
            password = ""
            transactionInProgressShow.set(false)
            transactionInProgress.set(false)

            return resolvedPromise?.value.data
        }


    };

    async function getTokens() {
        getSubgraphData($activeNetwork, {}, VAULTS_QUERY, "offchainAssetReceiptVaults").then((res) => {
            if ($activeNetwork) {
                let temp = res.data.offchainAssetReceiptVaults;
                tokens.set(temp);
            } else {
                tokens.set([])
            }
        });

    }

    async function handleTokenSelect(event) {
        let token = event.detail.token
        if (token.address === $vault.address) {
            navigate(`#token-overview/${token.address}`, {clear: true})
            return
        }
        await showPrompt(null, {topText: "SFT loading, please wait", noBottomText: true})
        let contract = await getContract($activeNetwork, token.address, contractAbi, $ethersData.signerOrProvider)
        if (contract) {
            vault.set(contract)
            schemas.set([])
            localStorage.setItem("vaultAddress", token.address)
            let auditHistoryData = await getAuditHistoryData(token.address)
            auditHistory.set(auditHistoryData)
            accountRoles.set(await setAccountRoles($roles, $account));
            transactionInProgressShow.set(false)
            transactionInProgress.set(false)
            navigate(`#token-overview/${token.address}`, {clear: true})
        }
    }

    async function getAuditHistoryData(token) {
        let data = await getSubgraphData($activeNetwork, {id: token.toLowerCase()}, AUDIT_HISTORY_DATA_QUERY, 'offchainAssetReceiptVault')
        if (data) {
            return data.data.offchainAssetReceiptVault
        } else return {}
    }

    let isListEditorOpen = false

    async function handleOkButtonClick(event) {
        let token = await getContract($activeNetwork, event.detail.token.address, contractAbi, $ethersData.signerOrProvider)

        credentialLinks = event.detail.credentialLinks
        try {

            let encodedCredentialsList = encodeCBOR(credentialLinks, MAGIC_NUMBERS.OA_TOKEN_CREDENTIAL_LINKS)

            try {
                let uploadResult = await upload(JSON.stringify(credentialLinks))
                let encodedHashList = cborEncode(
                    [uploadResult?.Hash].toString(),
                    MAGIC_NUMBERS.OA_HASH_LIST
                );
                const meta = "0x" + MAGIC_NUMBERS.RAIN_META_DOCUMENT.toString(16).toLowerCase() +
                    encodedCredentialsList +
                    encodedHashList
                let transaction = await token.connect($ethersData.signer).receiptVaultInformation(arrayify(meta))
                await showPromptSFTCreate(transaction)

                let wait = await transaction.wait()
                let variables = {id: token.address.toLowerCase()}
                if (wait.status === 1) {
                    let interval = setInterval(async () => {
                        let infoResp = await getSubgraphData($activeNetwork, variables, VAULT_INFORMATION_QUERY, 'offchainAssetReceiptVault')
                        infoResp = infoResp?.data?.offchainAssetReceiptVault
                        if (infoResp && infoResp.receiptVaultInformations && infoResp.receiptVaultInformations.length) {
                            if (wait.blockNumber.toString() ===
                                infoResp.receiptVaultInformations[0].transaction.blockNumber) {
                                transactionSuccess.set(true)
                                transactionInProgress.set(false)
                                clearInterval(interval)
                                await getTokens()
                            }
                        }
                    }, 2000)
                } else {
                    transactionError.set(true)
                }

            } catch (err) {
                console.log(err)
            }

        } catch (err) {
            console.log(err)
        }
    }

    function searchToken() {
        if (searchText) {
            computedTokens = $tokens.filter(t => t.name.toLowerCase().includes(searchText.toLowerCase()) ||
                t.address.toLowerCase().includes(searchText.toLowerCase()))
        } else {
            computedTokens = $tokens
        }
    }
</script>
<div class="flex flex-col w-full items-center home-container relative">
  <div class="views flex justify-end pt-4 view-buttons ">
    <div class="search-bar">
      <div class="search-input-cont">
        <input class="search-input" bind:value={searchText} placeholder="Search by Address/ Token name"/>
        <img src={icons.search_icon} alt="search" class="search-icon">
      </div>

    </div>
    <div class="view-changer-buttons">
      <div class="cursor-pointer tile-view-button" on:click={()=>{view = "tile"}}>
        <img src={icons.tile_view} alt="tiles">
      </div>
      <div class="cursor-pointer list-view-button" on:click={()=>{view = "list"}}>
        <img src={icons.list_view} alt="tiles">
      </div>
    </div>

  </div>
  {#if $tokensLoading}
    <div class="loader">
      <SftLoader></SftLoader>
    </div>
  {/if}
  {#if $tokens && $tokens.length && !$tokensLoading}
    <div class="{$sftInfo ? 'w-full' : view === 'list' ? 'list-view': 'tile-view'} tokens mr-5">
      {#if (view === "tile")}
        <TileView tokens={computedTokens} on:tokenSelect={handleTokenSelect}
                  on:fileDrop={deployImage} on:okClick={handleOkButtonClick}/>
      {/if}
      {#if (view === "list")}
        <ListView tokens={computedTokens} on:tokenSelect={handleTokenSelect}
                  on:fileDrop={deployImage}
                  on:listEditClick={()=>{isListEditorOpen=true}} on:listEditClosed={()=>{isListEditorOpen=false}}/>
      {/if}
      {#if !isListEditorOpen}
        <div class="note">
          <span class="py-2">Note: token creation is permissionless and so all the data on this site could be malicious/ scam, please do your own research before downloading any files or buying any tokens. </span>
        </div>
      {/if}
    </div>
  {/if}
</div>
<style>

    .views {
        gap: 21px;
        right: 0;
        width: calc(100% - 224px);
        padding-right: 16px;
        padding-bottom: 10px;
        align-items: center;
    }

    .view-buttons {
        position: fixed;
        top: 56px;
        background: #dcdbdd;
        z-index: 1;
    }

    .loader {
        margin-left: 203px;
    }

    .note {
        color: #575757;
        position: sticky;
        bottom: 0;
        font-size: 14px;
        text-align: center;
        background: #DCDBDD;
        padding: 0.5rem 0;
    }

    .list-view {
        align-self: end;
        width: calc(100% - 243px);
        margin-right: 20px;
    }

    .tile-view {
        align-self: end;
        width: calc(100% - 320px);
        margin-right: 6rem;
    }

    .view-changer-buttons {
        display: flex;
        gap: 14px;
    }

    .search-bar {
        width: 100%;
        text-align: right;
        display: flex;
        justify-content: flex-end;
    }

    .search-input-cont {
        position: relative;
        width: calc(50% - 10px);
    }

    .search-icon {
        position: absolute;
        left: 12px;
        top: 6px;
    }

    .search-input {
        border-radius: 10px;
        border: none;
        color: #000000;
        width: 100%;
        padding: 6px 46px;
    }

    .search-input, .search-input::placeholder {
        font-family: 'Mukta', sans-serif;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        height: 35px;
    }

</style>


