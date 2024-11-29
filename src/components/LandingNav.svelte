<script>
    import {landing} from '../scripts/store.js';
    import {navigate} from '../scripts/helpers.js';
    import {Link, router} from 'yrv'
    import {icons} from '../scripts/assets.js';

    function launchApp() {
        landing.set(false)
        navigate("#list")
    }

    let showDropdown = false;

    const membersPages = ['#investors', '#curators', '#issuers', '#auditors']
    const goldLogoPages = ['#investors', '#transparency']
</script>
<div class="landing-logo">
  <Link href="#">
    <img src="{goldLogoPages.includes($router.path) ? icons.logo :icons.sft_logo_white}" alt="sft" class="logo">
  </Link>
  <div class="landing-nav-container">
    <div class="links">
      <div class="dropdown">
        <div class="{membersPages.includes($router.path) ? 'active link' : 'link'}">
          <span class="cursor-pointer dropdown-trigger" on:mouseenter={()=>{showDropdown = true}}>SFT Ecosystems</span>
          <div class="hamburger" on:click={()=>{showDropdown = !showDropdown}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
              <path d="M11.25 15.75H42.75" stroke="{goldLogoPages.includes($router.path) ? '#2C2C54': 'white'}"
                    stroke-width="3" stroke-linecap="round"
                    stroke-linejoin="round"/>
              <path d="M11.25 27H42.75" stroke="{goldLogoPages.includes($router.path) ? '#2C2C54': 'white'}"
                    stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M11.25 38.25H42.75" stroke="{goldLogoPages.includes($router.path) ? '#2C2C54': 'white'}"
                    stroke-width="3" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="dropdown-content-wrapper">
          {#if showDropdown}
            <div class="dropdown-content">
              <a href="/#investors"
                 class="{$router.path === '#investors' ? 'active-list-item' : ''} investors">Investors</a>
              <a href="/#curators"
                 class="{$router.path === '#curators' ? 'active-list-item' : ''}   curators">Curators</a>
              <a href="/#issuers"
                 class="{$router.path === '#issuers' ? 'active-list-item' : ''}     issuers">Issuers</a>
              <a href="/#auditors"
                 class="{$router.path === '#auditors' ? 'active-list-item' : ''}   auditors">Auditors</a>
              <div class="transparency-link pt-6">
                <a href="/#transparency" class="{$router.path === '#transparency' ? 'active-list-item' : ''} ">SFT
                  transparency</a>
              </div>

            </div>
          {/if}
        </div>

      </div>
      <div class="{$router.path === '#transparency' ? 'active link' : 'link'} transparency-button">
        <Link href="#transparency">SFT transparency</Link>
      </div>
      <div class="{$router.path === '#case-studies' ? 'active link' : 'link'} transparency-button">
        <Link href="#case-studies">Case studies</Link>
      </div>
      <button class="launch-button" id="launch-button" on:click="{()=>launchApp()}">Launch app</button>
    </div>
  </div>
</div>
<style>

    .landing-logo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-top: 25px;
        padding-left: 9vw;
        padding-right: 48px;
        position: absolute;
        z-index: 3;
    }

    .landing-logo img {
        width: 65px;
        height: 65px;
    }

    .launch-button {
        margin-left: 38px;
        border-radius: 30px;
        background: #2C2C54;
        color: #FFFFFF;
        font-family: 'Mukta', sans-serif;
        font-size: 25px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        padding: 5px 40px;
        width: fit-content;
    }

    .links {
        display: flex;
        align-items: center;
        gap: 46px;
        color: #2C2C54;
        text-align: center;
        font-family: 'Inter', sans-serif;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }

    .link {
        padding: 3px 0;
        border: 1px solid transparent;
    }

    .dropdown-content-wrapper {
        border-top: 10px solid transparent;
        display: none;
        position: absolute;
        z-index: 1;
        width: 100%;
    }

    .links .active {
        border-bottom: 3px solid #2C2C54;
    }

    /* Base styles for the dropdown */
    .dropdown {
        position: relative;
        display: inline-block;
    }

    /* Styles for the dropdown trigger */
    .dropdown .link {
        cursor: pointer;
    }

    /* Styles for the dropdown content */
    .dropdown-content {
        background-color: rgba(255, 255, 255, 0.10);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        z-index: 1;
        width: 100%;
        flex-direction: column;
        gap: 12px;
    }

    /* Styles for each dropdown item */
    .dropdown-content a {
        padding: 6px 16px;
        display: block;
        text-decoration: none;
        color: var(--Dark-Blue, #2C2C54);
        text-align: center;
        font-family: 'Inter', sans-serif;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }

    /* Hover effect for dropdown items */
    .dropdown-content a:hover, .active-list-item {
        background-color: #CAE6FF;
    }


    /* Display the dropdown content when hovering over the dropdown */
    .dropdown:hover .dropdown-content {
        display: flex;
    }

    .dropdown:hover .dropdown-content-wrapper {
        display: flex;
    }

    .hamburger, .transparency-link {
        display: none;
    }

    @media only screen and (max-width: 920px) {
        #launch-button {
            display: none;
        }

        .landing-logo {
            padding-top: 23px;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
        }

        .landing-nav-container {
            margin-right: 16px;
        }

        .landing-logo .logo {
            margin-left: 20px;
        }


        .dropdown-trigger {
            display: none;
        }

        .transparency-button {
            display: none;
        }

        .hamburger {
            display: block;
        }

        .dropdown-content-wrapper {
            right: calc(30px - 3vw);
            width: unset;
            background: #535353;
            border-top: 0;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
            border-radius: 0 0 10px 10px;
        }

        .dropdown-content {
            gap: 2.1vw;
            padding: 2.1vw 3.5vw;
            border-radius: 0 0 10px 10px;
            white-space: nowrap;
            align-items: start;
        }

        .dropdown-content a {
            color: #FFF;
            font-family: 'Inter', sans-serif;
            font-size: calc(15px + 0.390625vw);
            font-style: normal;
            font-weight: 700;
            line-height: normal;
        }

        .transparency-link {
            display: flex;
            border-top: 1px solid #AAA;
        }

        .links .active {
            border-bottom: none;
        }

        .dropdown-content a.active-list-item {
            color: #2C2C54;
            background: transparent;
        }
    }
</style>