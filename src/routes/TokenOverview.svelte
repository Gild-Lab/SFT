<script>
    import {
        sftInfo,
        account,
        activeNetwork,
        ethersData,
        transactionSuccess,
        transactionInProgress, transactionError, transactionInProgressShow, activeToken
    } from '../scripts/store.js';
    import TokenOverviewTable from '../components/TokenOverviewTable.svelte';
    import {
        bytesToMeta,
        cborDecode,
        cborEncode,
        encodeCBOR,
        getContract, getSubgraphData,
        navigate, showPrompt,
        showPromptSFTCreate
    } from '../scripts/helpers.js';
    import {IPFS_APIS, IPFS_GETWAY, MAGIC_NUMBERS} from '../scripts/consts.js';
    import SftCredentialLinks from '../components/SftCredentialLinks.svelte';
    import {icons} from '../scripts/assets.js';
    import contractAbi from '../contract/OffchainAssetVaultAbi.json';
    import {QUERY, RECEIPT_VAULT_INFORMATION_QUERY, VAULT_INFORMATION_QUERY} from '../scripts/queries.js';
    import axios from 'axios';
    import {arrayify} from 'ethers/lib/utils.js';
    import CredentialLinksEditor from '../components/CredentialLinksEditor.svelte';
    import {router} from 'yrv';

    $:$activeNetwork && getToken()
    $:token && getVaultInformation()

    let address = $router.params.address
    let token = {}
    let logoPreview;
    let username;
    let password;
    let tokenLogo;
    let isEditorOpen = false;
    let credentialLinks;

    async function getVaultInformation() {
        if (token && token.id) {
            let receiptVaultInformations = token.receiptVaultInformations
            if (receiptVaultInformations.length) {
                let receiptInformations = receiptVaultInformations.map(data => {
                    return cborDecode(data.information.slice(18))
                })
                let sftImages = receiptInformations.filter(i => i[0].get(1) === MAGIC_NUMBERS.OA_TOKEN_IMAGE)
                let sftCredentialLinks = receiptInformations.filter(i => i[0].get(1) ===
                    MAGIC_NUMBERS.OA_TOKEN_CREDENTIAL_LINKS)
                if (sftImages.length) {
                    token.icon = sftImages[0][1].get(0)
                }
                if (sftCredentialLinks.length) {
                    token.credentialLinks = bytesToMeta(sftCredentialLinks[0][0].get(0), "json")
                }
            }
        }
    }

    const onFileSelected = (e) => {
        deployImage(e.target.files[0])
    }

    async function getToken() {
        let variables = {id: address}
        let res;
        try {
            res = await getSubgraphData($activeNetwork, variables, QUERY, 'offchainAssetReceiptVault')
            if (res && res.data) {
                token = res.data.offchainAssetReceiptVault
                activeToken.set(token)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function deployImage(file) {
        let vault = await getContract($activeNetwork, token.address, contractAbi, $ethersData.signerOrProvider)
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
                                await getToken()

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

    function handleEditClick(event) {
        isEditorOpen = true
    }

    async function handleOkButtonClick(event) {

        let token = await getContract($activeNetwork, event.detail.token.address, contractAbi, $ethersData.signerOrProvider)

        credentialLinks = event.detail.credentialLinks

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
                            await getToken()
                        }
                    }
                }, 2000)
            } else {
                transactionError.set(true)
            }

        } catch (err) {
            console.log(err)
        }
    }

</script>
{#if !isEditorOpen}
  <div class="{$sftInfo ? '' : 'left-margin'} token-overview-container">
    <div class="flex justify-between mb-2">
      <div class="links">
        <SftCredentialLinks sft={token} on:editClick={handleEditClick}></SftCredentialLinks>
      </div>
    </div>
    <div class="content">
      <div class="w-full flex justify-between">
        <div class="w-1/2">
          <TokenOverviewTable {token}/>
        </div>
        <div class="sft-image w-1/2">
          <div class="sft-logo-container relative rounded-full"
               class:hover={token?.deployer?.toLowerCase() === $account.toLowerCase()}>
            <label for={`${token.address}-upload`} id="sft-logo-upload"
                   class="flex items-center justify-center text-white flex-col {token?.deployer?.toLowerCase() === $account.toLowerCase() ? 'cursor-pointer' : '' }">
              {#if token.icon}
                <img src={`${IPFS_GETWAY}${token.icon}`} alt="token logo" class="logo" bind:this={logoPreview}/>
                {#if token?.deployer?.toLowerCase() === $account.toLowerCase()}
                  <div class="update">
                    <div class="relative">
                      <div class="update-container">
                        <img src="{icons.camera}" alt="token logo"/>
                        <span class="text">Update</span>
                      </div>
                      <svg width="303" height="303" viewBox="0 0 303 303" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_3572_11735" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                              width="303" height="303">
                          <circle cx="151.5" cy="151.5" r="151.5" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_3572_11735)">
                          <rect x="-1.43555" y="178.914" width="303" height="142.843" fill="black" fill-opacity="0.6"/>
                        </g>
                      </svg>
                    </div>
                  </div>
                {/if}
              {/if}
              {#if !token.icon}
                {#if token?.deployer?.toLowerCase() === $account.toLowerCase()}
                  <img src="{icons.camera}" alt="token logo"/>
                  <span class="text">Update</span>
                {/if}
              {/if}
              {#if token?.deployer?.toLowerCase() === $account.toLowerCase()}
                <input type="file" id={`${token.address}-upload`} hidden accept=".jpg, .jpeg, .png, .svg"
                       on:change={(e)=>onFileSelected(e)}
                       bind:this={tokenLogo}/>
              {/if}
            </label>

          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
{#if isEditorOpen}
  <div class="editor mr-16 pt-4 left-margin w-full">
    <div class="back flex ml-5 w-full cursor-pointer" on:click={()=>{isEditorOpen = false}}>
      <img src={icons.back} alt="back" class="mr-6">
    </div>
    <CredentialLinksEditor on:okClick={handleOkButtonClick} sft={token}/>
  </div>
{/if}
<style>
    .editor {
        background: #FFFFFF;
        height: 100vh;
        border-radius: 8px;
    }

    .left-margin {
        margin-left: 223px;
    }

    .token-overview-container {
        background: #FFFFFF;
        border-radius: 10px 10px 0 0;
        margin-right: 102px;
        color: #000000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 14px 20px 20px 20px;
        height: 100vh;
    }

    .content {
        border: 1px solid #C1C1C1;
        border-radius: 10px;
        padding: 20px;
        height: 100%;
    }

    .sft-image {
        display: flex;
        justify-content: center;
    }

    #sft-logo-upload:hover .update{
        display: flex ;
    }

    .sft-logo-container {
        background: #9D9D9D;
        width: 303px;
        height: 303px;
        display: flex;
        justify-content: center;
    }

    .sft-logo-container .logo {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .sft-logo-container.hover:hover {
        background: rgba(0, 0, 0, 0.6);
    }

    .sft-logo-container .update {
        position: absolute;
        display: none;
    }

    .update-container {
        position: absolute;
        top: 70%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

</style>