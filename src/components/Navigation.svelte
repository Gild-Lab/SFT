<script>
    import {sftInfo, tokenName, vault, account} from "../scripts/store.js";
    import NavigationButton from './NavigationButton.svelte';
    import TokenOverviewTable from './TokenOverviewTable.svelte';
    import {navigate} from '../scripts/helpers.js';
    import {Link} from 'yrv';

    let managerAddress = import.meta.env.VITE_MANAGER_ADDRESS;
    let isManager = false;

    function showSftInfo() {
        sftInfo.set(true)
    }

    function hideSftInfo() {
        sftInfo.set(false)
    }

    export let path = "/"
    export let token = {}

    function handleClick(e) {
        navigate(e.detail, {clear: true})
    }

    function checkConnectedAddress() {
        isManager = $account.toLowerCase() === managerAddress.toLowerCase();
    }

    $: $account && checkConnectedAddress()

</script>
<div class="navigation-container relative h-full flex flex-col">
  <div
    class="flex justify-start items-start bg-white flex-col navigation top-14 fixed h-full">
    <div class="flex justify-center items-center w-full space-x-3">
      {#if !$sftInfo && $vault.address}
        <div class="cursor-pointer absolute right-2 top-2 z-10" on:click={()=>showSftInfo()}>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 10.3999L19 5.1999M19 5.1999L19 10.3999M19 5.1999L14 5.1999" stroke="#9D9D9D" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 10.3999L19 5.1999M19 5.1999L19 10.3999M19 5.1999L14 5.1999" stroke="black" stroke-opacity="0.2"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 14.5601L5 19.7601M5 19.7601L5 14.5601M5 19.7601H10" stroke="#9D9D9D" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 14.5601L5 19.7601M5 19.7601L5 14.5601M5 19.7601H10" stroke="black" stroke-opacity="0.2"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      {/if}
    </div>
    <div class="mt-16 flex flex-col justify-start items-center w-full">
      <Link href="#token-overview/{$vault.address}">
        <div
          class="sft-name f-weight-600 menu-header mb-3 {$tokenName? 'sft-name-navigation-header':''}">{$tokenName}</div>
      </Link>
      <a href=""
         class="flex justify-start items-center space-x-6 w-full  focus:outline-none  focus:text-indigo-400 rounded py-2 text-nav font-semibold pl-5">
        <span class="text-base leading-5 menu-header">SFT</span>
      </a>
      <NavigationButton targetPath="#list" {path} on:navClick={handleClick}>
        <div slot="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.77778 10.2222V18C5.77778 19.1046 6.67321 20 7.77778 20H12M5.77778 10.2222L11.2929 4.70711C11.6834 4.31658 12.3166 4.31658 12.7071 4.70711L17.5 9.5M5.77778 10.2222L4 12M18.2222 10.2222V18C18.2222 19.1046 17.3268 20 16.2222 20H12M18.2222 10.2222L20 12M18.2222 10.2222L17.5 9.5M17.5 9.5V6M12 20V15"
              stroke="#575757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </NavigationButton>
      {#if $vault && $vault.address}
        <NavigationButton label={$tokenName} {path}>
          <div slot="icon" class="navigation-token-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" stroke="#575757" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>
          </div>
        </NavigationButton>
        <NavigationButton targetPath="#mint" {path} child={true} on:navClick={handleClick}/>
        <NavigationButton targetPath="#asset-classes" {path} child={true} on:navClick={handleClick}/>
        <NavigationButton targetPath="#members" {path} child={true} on:navClick={handleClick}/>
        <NavigationButton targetPath="#roles" {path} child={true} on:navClick={handleClick}/>
        <NavigationButton targetPath="#audit-history" {path} child={true} on:navClick={handleClick}/>
        <NavigationButton targetPath="#asset-register" {path} child={true} on:navClick={handleClick}/>
      {/if}

      <NavigationButton targetPath="#knowledgebase" {path} externalUrl="https://gildlab.document360.io/">
        <div slot="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 6.05337V20.3025M5 8.25464C6.26578 8.45067 7.67778 8.77657 9 9.28788M5 12.2546C5.63949 12.3537 6.3163 12.4859 7 12.6584M3.99433 3.01127C6.21271 3.26195 9.19313 3.93632 11.3168 5.42445C11.725 5.71045 12.275 5.71045 12.6832 5.42445C14.8069 3.93632 17.7873 3.26195 20.0057 3.01127C21.1036 2.88721 22 3.80402 22 4.93518V16.2C22 17.3311 21.1036 18.2483 20.0057 18.3723C17.7873 18.623 14.8069 19.2974 12.6832 20.7855C12.275 21.0715 11.725 21.0715 11.3168 20.7855C9.19313 19.2974 6.21271 18.623 3.99433 18.3723C2.89642 18.2483 2 17.3311 2 16.2V4.93518C2 3.80402 2.89642 2.88721 3.99433 3.01127Z"
              stroke="#575757" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </NavigationButton>
    </div>
    <div class="items-center pt-4 border-b w-11/12 self-center"></div>
    <div class="mt-4 flex flex-col justify-start items-center w-full">
      <a href=""
         class="flex jusitfy-start items-center space-x-6 w-full  focus:outline-none  focus:text-indigo-400 rounded py-2 text-nav font-semibold pl-5">
        <span class="leading-5 menu-header">Web 3</span>
      </a>

      <NavigationButton label="IPFS" {path}>
        <div slot="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 10.6562V8.625C18 7.72754 17.2538 7 16.3333 7H4.66667C3.74619 7 3 7.72754 3 8.625V12.6875C3 13.585 3.74619 14.3125 4.66667 14.3125H9.5625M16.3333 15.125V13.5C16.3333 12.6025 15.5871 11.875 14.6667 11.875C13.7462 11.875 13 12.6025 13 13.5V15.125M12.1667 20H17.1667C17.6269 20 18 19.6362 18 19.1875V15.9375C18 15.4888 17.6269 15.125 17.1667 15.125H12.1667C11.7064 15.125 11.3333 15.4888 11.3333 15.9375V19.1875C11.3333 19.6362 11.7064 20 12.1667 20Z"
              stroke="#575757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="6.5" cy="10.5" r="1.5" fill="#575757"/>
            <circle cx="11.5" cy="10.5" r="1.5" fill="#575757"/>
          </svg>
        </div>
      </NavigationButton>
      <NavigationButton targetPath="#ipfs-login" {path} on:navClick={handleClick} child={true}/>
      {#if isManager}
        <NavigationButton targetPath="#track-addresses" {path} on:navClick={handleClick} child={true}/>
      {/if}
      <NavigationButton targetPath="#setup" {path} on:navClick={handleClick}>
        <div slot="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_3949_12119)">
              <path
                d="M12.8311 15.4956H16.5729M16.5729 15.4956H20.2145M16.5729 15.4956L16.5805 11.7666M16.5729 15.4956L16.5947 19.1736"
                stroke="#575757" stroke-width="2.07204" stroke-linecap="round" stroke-linejoin="round"/>
              <path
                d="M20.5154 12.0004C20.5154 11.269 20.4227 10.5594 20.2495 9.88202C19.3063 6.20543 15.9684 3.48535 12.0004 3.48535C7.30103 3.48535 3.48535 7.30103 3.48535 12.0004C3.48535 16.6997 7.30103 20.5154 12.0004 20.5154C12.5151 20.5154 13.0184 20.47 13.5075 20.382"
                stroke="#575757" stroke-width="1.89223" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_3949_12119">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </NavigationButton>
    </div>
  </div>

  {#if ($sftInfo)}
    <div class="bg-white w-5/12 rounded-tr-10 relative border-l sft-info">
      <div class="cursor-pointer absolute right-2 top-2" on:click={()=>hideSftInfo()}>
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.96387 5L10.9731 10M10.9731 10V5M10.9731 10H5.96387" stroke="#9D9D9D" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5.96387 5L10.9731 10M10.9731 10V5M10.9731 10H5.96387" stroke="black" stroke-opacity="0.2"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19.9902 19L14.981 14M14.981 14L14.981 19M14.981 14L19.9902 14" stroke="#9D9D9D" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19.9902 19L14.981 14M14.981 14L14.981 19M14.981 14L19.9902 14" stroke="black" stroke-opacity="0.2"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="flex flex-col pt-10 px-5 sft-info-table">
        <span class="font-bold self-center mb-5">Token overview</span>
        <TokenOverviewTable {token} navigation="{true}"/>
      </div>
    </div>

  {/if}

</div>

<style lang="postcss">

    .text-nav {
        color: #5F9AD1;
    }

    .navigation-container {
        z-index: 2;
    }

    .navigation {
        min-width: 203px;
        max-width: 203px;
    }

    .sft-info {
        width: 22rem;
        margin-left: 12.71rem;
        margin-top: 3.5rem;
        height: 100%;
        position: fixed;
        z-index: 3;
    }

    .menu-header {
        color: #5F9AD1;
    }

    .sft-info-table {
        color: #575757;
    }


</style>
