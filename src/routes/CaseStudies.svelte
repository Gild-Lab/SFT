<script>
    import {icons} from '../scripts/assets.js';
    import LandingNav from '../components/LandingNav.svelte';
    import {landing} from '../scripts/store.js';
    import {navigate} from '../scripts/helpers.js';
    import {onMount} from 'svelte';

    import {Link} from 'yrv';

    function launchApp() {
        landing.set(false)
        navigate("#list")
    }

    let isDocumentLoaded = false;

    let imagesLoaded = 0;
    const totalImages = 12;

    function handleImageLoad() {
        imagesLoaded++;

        if (imagesLoaded === totalImages) {
            isDocumentLoaded = true;
        }
    }

    onMount(() => {
        const images = document.querySelectorAll('img');

        images.forEach((image) => {
            image.addEventListener('load', handleImageLoad);
        });
    });

</script>

<div class="landing-container {isDocumentLoaded? 'show':'hide'}">
  <div class="poem-gradient1"></div>
  <div class="poem-gradient2"></div>
  <div class="poem-gradient3"></div>
  <div class="poem-gradient4"></div>
  <div class="poem-gradient5"></div>
  <div class="poem-gradient6"></div>
  <div class="poem-gradient7"></div>
  <div class="poem-gradient8"></div>
  <div class="poem-gradient-resp-1 d-none"></div>
  <div class="poem-gradient-resp-2 d-none">
    <svg xmlns="http://www.w3.org/2000/svg" width="920" height="1016" viewBox="0 0 920 1016" fill="none">
      <path
        d="M2371 172C2371 638.128 1581.01 1016 606.5 1016C-368.006 1016 -1158 638.128 -1158 172C-1158 -294.128 -368.006 -672 606.5 -672C1581.01 -672 2371 -294.128 2371 172Z"
        fill="url(#paint0_radial_7846_9403)"/>
      <defs>
        <radialGradient id="paint0_radial_7846_9403" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(224.085 121.721) rotate(-158.213) scale(915.355 591.723)">
          <stop stop-color="#72A4F0"/>
          <stop offset="0.535632" stop-color="#5C75B9" stop-opacity="0.606986"/>
          <stop offset="1" stop-color="#3A2B63" stop-opacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  </div>
  <LandingNav/>
  <div class="landing-head">
    <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1016" viewBox="0 0 1440 1016" fill="none"
         class="head-gradient">
      <path
        d="M2371 172C2371 638.128 1581.01 1016 606.5 1016C-368.006 1016 -1158 638.128 -1158 172C-1158 -294.128 -368.006 -672 606.5 -672C1581.01 -672 2371 -294.128 2371 172Z"
        fill="url(#paint0_radial_6596_11952)"/>
      <defs>
        <radialGradient id="paint0_radial_6596_11952" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(224.085 121.721) rotate(-158.213) scale(915.355 591.723)">
          <stop stop-color="#72A4F0"/>
          <stop offset="0.535632" stop-color="#5C75B9" stop-opacity="0.606986"/>
          <stop offset="1" stop-color="#3A2B63" stop-opacity="0"/>
        </radialGradient>
      </defs>
    </svg>

    <div class="globe-container flex gap-2 w-full justify-between">
      <div class="text">

        <div class="title">Semi-Fungible Tokens (SFT) by Gild Lab Case Study: LOVE TO Be Bright Green</div>
        <div class="info flex gap-6 items-end">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="16" y1="1" x2="-8.74228e-08" y2="0.999999" stroke="white" stroke-width="2"/>
            <line x1="1" y1="4.37114e-08" x2="0.999999" y2="16" stroke="white" stroke-width="2"/>
          </svg>
          <img src="{icons.tim}" alt="tim bennett">
          <div>
            Interviewee: Tim Bennett
            <br>
            Co-Founder and Director
          </div>

        </div>
        <div class="flex gap-20 py-4 text-lg text-white">
          <a class="underline cursor-pointer hover:opacity-50" href="https://www.loveto.group/" target="_blank">www.loveto.group</a>
          <a class="underline cursor-pointer hover:opacity-50" href="#" target="_blank">Token Contract </a>
          <a class="underline cursor-pointer hover:opacity-50" href="#" target="_blank">LOVE TO Be Bright Green Whitepaper</a>
        </div>

      </div>
      <div class="globe">
        <img src="{icons.globe}" alt="globe"/>
      </div>
    </div>
  </div>

<!--  <div class="poems">-->
<!--    <div class="groups">-->
<!--      <div class="group-item">-->
<!--        <div class="group-title-resp">Investors</div>-->
<!--        <img src="{icons.investor_hero_tile}" alt="investor" class="group-hero investors-hero "/>-->
<!--        <div class="color-4 group-icon group-icon-left"><img src="{icons.investor_icon}" alt="investor"/></div>-->
<!--        <div class="group-text left-0 flex flex-col justify-between">-->
<!--          <div class="group-title">Investors</div>-->
<!--          <div class="group-info">-->
<!--            <span>Buy/ trade/ hold tokens based on individual research & info from curators.</span>-->
<!--            <span>Organic liquidity for high quality tokens is built.</span>-->
<!--          </div>-->
<!--          <Link href="#investors" class="items-center flex w-full justify-center">-->
<!--            <div class="launch-button investors-read-more ">Read more</div>-->
<!--          </Link>-->
<!--        </div>-->

<!--      </div>-->

<!--      <div class="group-item">-->
<!--        <div class="group-title-resp text-white">Curators</div>-->
<!--        <img src="{icons.curator_hero}" alt="curators" class="group-hero curators-hero"/>-->
<!--        <div class="color-1 group-icon group-icon-right"><img src="{icons.curator_icon}" alt="curators"/></div>-->
<!--        <div class="group-text flex flex-col justify-between right-0 group-text-right">-->
<!--          <div class="group-title">Curators</div>-->
<!--          <div class="group-info">-->
<!--            <span>Research reputable tokens and issuers to help investors make decisions.</span>-->
<!--            <span>Every recommendation is recorded permanently onchain so that investors can assess the quality of each curator.</span>-->
<!--          </div>-->
<!--          <Link href="#curators" class="items-center flex w-full justify-center">-->
<!--            <div class="launch-button curators-read-more ">Read more</div>-->
<!--          </Link>-->
<!--        </div>-->

<!--      </div>-->

<!--      <div class="group-item">-->
<!--        <div class="group-title-resp text-white">Issuers</div>-->
<!--        <img src="{icons.issuers_hero}" alt="issuers" class="group-hero"/>-->
<!--        <div class="color-2 group-icon group-icon-left"><img src="{icons.issuers_icon}" alt="issuers"/></div>-->
<!--        <div class="group-text left-0 flex flex-col justify-between">-->
<!--          <div class="group-title">Issuers</div>-->
<!--          <div class="group-info">-->
<!--            <span>Mint (create) the tokens.</span>-->
<!--            <span>Real world assets associated with each token.</span>-->
<!--            <span>Issuance is permissionless; it is up to each issuer to prove the quality of their offering.</span>-->
<!--          </div>-->
<!--          <Link href="#issuers" class="items-center flex w-full justify-center">-->
<!--            <div class="launch-button issuers-read-more ">Read more</div>-->
<!--          </Link>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="group-item">-->
<!--        <div class="group-title-resp text-white">Auditors</div>-->
<!--        <img src="{icons.auditors_hero}" alt="curators" class="group-hero auditors-hero"/>-->
<!--        <div class="color-3 group-icon lock group-icon-right"><img src="{icons.lock}" alt="curators"/></div>-->
<!--        <div class="group-text flex flex-col justify-between right-0 group-text-right">-->
<!--          <div class="group-title">Auditors</div>-->
<!--          <div class="group-info">-->
<!--            <span>Auditors check that all onchain data matches offchain reality.</span>-->
<!--            <span>Appointed by the issuer, high quality audits improve investor confidence to increase token liquidity.</span>-->
<!--            <span>If an audit fails, the token freezes (transfers are paused) until the problem is fixed.</span>-->
<!--          </div>-->
<!--          <Link href="#auditors" class="items-center flex w-full justify-center">-->
<!--            <div class="launch-button auditors-read-more ">Read more</div>-->
<!--          </Link>-->
<!--        </div>-->

<!--      </div>-->

<!--    </div>-->


<!--  </div>-->
<!--  <div class="relative z-10 set-up">-->

<!--    <div class="transparency">-->
<!--      <div class="left">-->
<!--        100% <span>transparency</span>-->
<!--        <br>-->
<!--        - facts checked by auditors-->
<!--        <br>(eg KPMG, Deloitte)-->

<!--      </div>-->
<!--      <div class="right">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none" class="eye">-->
<!--          <path-->
<!--            d="M28.5642 22.0001C28.5642 25.6301 25.6308 28.5634 22.0008 28.5634C18.3708 28.5634 15.4375 25.6301 15.4375 22.0001C15.4375 18.3701 18.3708 15.4368 22.0008 15.4368C25.6308 15.4368 28.5642 18.3701 28.5642 22.0001Z"-->
<!--            stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--          <path-->
<!--            d="M22.0017 37.1617C28.4733 37.1617 34.505 33.3484 38.7033 26.7484C40.3533 24.1634 40.3533 19.8184 38.7033 17.2334C34.505 10.6334 28.4733 6.82007 22.0017 6.82007C15.53 6.82007 9.49833 10.6334 5.3 17.2334C3.65 19.8184 3.65 24.1634 5.3 26.7484C9.49833 33.3484 15.53 37.1617 22.0017 37.1617Z"-->
<!--            stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--        </svg>-->
<!--        <a href="https://gildlab.document360.io/docs/sft-transparency" target="_blank">-->
<!--          <button class="launch-button read-more">Read more</button>-->
<!--        </a>-->
<!--      </div>-->


<!--    </div>-->
<!--    <div class="setting-up">-->
<!--      <label>Setting up a new token as easy as:</label>-->
<!--    </div>-->

<!--    <div class="groups-line"></div>-->
<!--    <div class="setting-up-flow">-->
<!--      <div class="flow">-->
<!--        <div class="icon color-1">1</div>-->
<!--        <div class="flow-text">-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" width="37" height="38" viewBox="0 0 37 38" fill="none">-->
<!--            <path-->
<!--              d="M19.7812 24.6559H25.55M25.55 24.6559H31.1641M25.55 24.6559L25.5616 18.907M25.55 24.6559L25.5835 30.326"-->
<!--              stroke="#575757" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--            <path-->
<!--              d="M31.6257 19.2665C31.6257 18.139 31.4828 17.045 31.2159 16.0007C29.7617 10.3326 24.6157 6.13916 18.4984 6.13916C11.2536 6.13916 5.37109 12.0217 5.37109 19.2665C5.37109 26.5113 11.2536 32.3938 18.4984 32.3938C19.2919 32.3938 20.0679 32.3238 20.8219 32.1881"-->
<!--              stroke="#575757" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--          </svg>-->
<!--          <span>Setup new SFT</span>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="flow">-->
<!--        <div class="icon color-2">2</div>-->
<!--        <div class="flow-text">-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" width="37" height="38" viewBox="0 0 37 38" fill="none">-->
<!--            <path-->
<!--              d="M6.16797 31.2161V29.6745C6.16797 25.4173 9.61911 21.9661 13.8763 21.9661H19.6576M27.0352 21.9114V27.362M27.0352 27.362V32.8126M27.0352 27.362H32.4858M27.0352 27.362H21.5846M23.1263 11.1745C23.1263 14.5802 20.3654 17.3411 16.9596 17.3411C13.5539 17.3411 10.793 14.5802 10.793 11.1745C10.793 7.76872 13.5539 5.00781 16.9596 5.00781C20.3654 5.00781 23.1263 7.76872 23.1263 11.1745Z"-->
<!--              stroke="#575757" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--          </svg>-->
<!--          <span>SFT roles</span>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="flow">-->
<!--        <div class="icon color-3">3</div>-->
<!--        <div class="flow-text">-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" width="37" height="38" viewBox="0 -7 37 38" fill="none">-->
<!--            <path-->
<!--              d="M17.0013 19.3333L17.0013 10.9999M17.0013 2.66658L17.0013 10.9999M17.0013 10.9999L2.33464 10.9999M17.0013 10.9999L31.668 10.9999M2.33464 10.9999L6.91798 16.2083M2.33464 10.9999L6.91797 5.79159M31.668 10.9999L27.0846 5.79158M31.668 10.9999L27.0846 16.2083"-->
<!--              stroke="#575757" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--          </svg>-->
<!--          <span>Mint/Redeem</span>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    <button class="launch-button bottom" id="launch-button-2" on:click={()=>launchApp()}>Launch app</button>-->
<!--  </div>-->

  <div class="landing-footer">
    <img src={icons.wave} alt="wave" class="wave">
    <img src={icons.wave_resp} alt="wave" class="wave-resp">
    <div class="landing-logo">
      <img src="{icons.sft_logo_white}" alt="sft">
    </div>
  </div>

</div>

<style>
    .landing-container {
        background: #B5DCFF;
        margin-left: auto;
        margin-right: auto;
        overflow: hidden;
        position: relative;
    }

    .landing-head {
        background: linear-gradient(178deg, #6F5EA1 57.64%, #B5DCFF 91.27%);
        position: relative;
        z-index: 1;
        overflow: hidden;
    }

    .head-gradient {
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
        height: 850px;
        flex-shrink: 0;
    }

    .launch-button {
        border-radius: 30px;
        background: #2C2C54;
        color: #FFFFFF;
        font-family: 'Mukta', sans-serif;
        font-size: calc(20px + 0.190625vw);
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        padding: 5px 40px;
        width: fit-content;
    }

    .globe-container {
        margin-top: 90px;
    }

    .text {
        width: 60%;
        display: flex;
        flex-direction: column;
        gap: 25px;
        padding-left: 9vw;
        align-items: flex-start;
        text-align: left;
        padding-top: 100px;
        padding-bottom: 100px;
    }

    .text .title {
        color: #FFF;
        font-family: 'Inter', sans-serif;
        font-size: calc(26px + 0.590625vw);
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }

    .text .info {
        color: #FFF;
        font-family: 'Manrope', sans-serif;
        font-size: calc(25px + 0.400625vw);
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        position: relative;
        margin-top: 20px;
    }

    .text .info svg {
        position: absolute;
        top: -13px;
        left: -41px
    }

    .text .info span {
        color: #FFF;
        font-family: 'Manrope', sans-serif;
        font-size: calc(25px + 0.400625vw);
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }

    .globe {
        height: auto;
        margin-right: 10vw;
        margin-top: 3vw;
        float: right;
    }

    .globe img {
        width: 366px;

        /*width: 100%;*/
        height: 366px;
    }

    .poems {
        width: 100%;
        margin-top: 200px;
        position: relative;
        z-index: 1;
    }

    .groups-line {
        margin-top: 80px;
        width: 100%;
        height: 6px;
        background: linear-gradient(90deg, #674AA5 8.61%, #59C3FF 100%);
    }

    .groups {
        display: flex;
        flex-direction: column;
        gap: 87px;
        width: 100%;
        align-items: center;
        margin-bottom: 235px;
    }

    .group-item {
        position: relative;
        width: calc(100% - 240px);
        align-items: center;
        justify-content: center;
        display: flex;
        background: #FFFFFF;
        flex-direction: column;
        border-radius: 20px;
        box-shadow: 0.2px 0.6px 0.7px hsl(222deg 36% 61% / 0.22),
        0.9px 2.5px 3px -0.3px hsl(222deg 36% 61% / 0.22),
        1.5px 4.4px 5.2px -0.6px hsl(222deg 36% 61% / 0.22),
        2.2px 6.6px 7.8px -0.8px hsl(222deg 36% 61% / 0.22),
        3.3px 9.6px 11.4px -1.1px hsl(222deg 36% 61% / 0.22),
        4.7px 13.7px 16.3px -1.4px hsl(222deg 36% 61% / 0.22),
        6.7px 19.5px 23.2px -1.7px hsl(222deg 36% 61% / 0.22),
        9.3px 27.2px 32.3px -1.9px hsl(222deg 36% 61% / 0.22),
        12.8px 37.3px 44.4px -2.2px hsl(222deg 36% 61% / 0.22),
        17.2px 50.3px 59.8px -2.5px hsl(222deg 36% 61% / 0.22);

    }

    .group-text {
        position: absolute;
        background: #FFFFFF;
        height: 100%;
        max-width: 50%;
        border-radius: 20px 0 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .group-text-right {
        border-radius: 0 20px 20px 0;

    }

    .group-icon {
        position: absolute;
        top: 3vw;
        padding: 14px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        z-index: 1;
        width: 9vw;
        height: 9vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .group-icon.lock img {
        height: 60px;
    }

    .group-icon img {
        width: 81px;
    }

    .group-hero {
        width: 100%;
        border-radius: 20px;
    }

    .curators-hero, .auditors-hero {
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
    }

    .group-icon-left {
        left: 50px
    }

    .group-icon-right {
        right: -5vw
    }

    .color-4 {
        background: #674AA5;
        filter: drop-shadow(0px 7px 8px #B4B3DB);
    }

    .color-1 {
        background: #655DB4;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    }

    .color-2 {
        background: #6180CD;
    }

    .color-3 {
        background: #5E97DF;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    }

    .group-title, .group-title-resp {
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: 700;
        background: linear-gradient(272deg, #5F9AD1 27.74%, #8B5BB0 56.07%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .group-title {
        font-size: calc(40px + 0.390625vw);
        line-height: calc(40px + 0.390625vw);
    }

    .group-title-resp {
        display: none;
        position: absolute;
        top: 7vw;
        left: 69px;
        z-index: 1;
        font-size: calc(35px + 0.500625vw);
        line-height: calc(35px + 0.500625vw);
    }

    .group-info {
        display: flex;
        flex-direction: column;
        gap: 1.5vw;
        color: #575757;
        font-family: 'Manrope', sans-serif;
        font-style: normal;
        font-weight: 400;
        max-width: calc(100% - 8vw);
        line-height: calc(28px + 0.500625vw);
        font-size: calc(14px + 0.500625vw);
    }

    .transparency {
        display: flex;
        border-radius: 0 10px 10px 0;
        background: #705FA2;
        padding: 40px 41px 40px 60px;
        width: calc(50% - 20px);
        color: #FFF;
        font-family: 'Manrope', sans-serif;
        font-size: calc(20px + 0.390625vw);
        font-style: normal;
        font-weight: 700;
        margin-bottom: 20vw;
        line-height: 40px; /* 160% */
        justify-content: space-between;
    }

    .transparency .right {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 45px
    }

    .transparency .left {
        text-align: left;
    }

    .transparency span {
        color: #88E2FF;
    }

    .setting-up {
        color: #575757;
        text-align: center;
        font-family: 'Mukta Mahee', sans-serif;
        font-size: calc(25px + 0.390625vw);
        font-style: normal;
        font-weight: 700;
        line-height: 40px; /* 133.333% */
    }

    .setting-up-flow {
        display: flex;
        justify-content: center;
        width: 100%;
        gap: 14vw;
        margin-bottom: 50px;
    }

    .flow {
        position: relative;
    }

    .flow-text {
        align-items: center;
        display: flex;
        gap: 1.5vw;
        margin-top: 3.5vw;
        color: #575757;
        text-align: center;
        font-family: 'Mukta', sans-serif;
        font-size: 2.1vw;
        font-style: normal;
        font-weight: 700;
        line-height: 2.3vw; /* 133.333% */
        white-space: nowrap;
    }

    .flow-text svg {
        width: 2.5vw;
    }

    .flow .icon {
        top: calc(-50% + 6px);
        left: 50%;
        position: absolute;
        border-radius: 50%;
        color: #FFF;
        text-align: center;
        font-family: 'Arial', sans-serif;
        font-size: 2.3vw;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        transform: translate(-50%, 12px);
        width: 3.8vw;
        height: 3.8vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .poem-gradient1 {
        position: absolute;
        width: 2641px;
        height: 1048px;
        border-radius: 2129px;
        background: radial-gradient(50.35% 50.24% at 46.09% 49.91%, #FFF 0%, rgba(245, 245, 245, 0.56) 67.25%, rgba(233, 233, 233, 0.00) 100%);
        top: 687px;
        z-index: 1;
        left: calc(-33% - 200px);
    }

    .poem-gradient2 {
        position: absolute;
        width: 1576px;
        height: 1378px;
        border-radius: 1576px;
        background: radial-gradient(50.35% 50.24% at 46.09% 49.91%, #FFF 0%, rgba(245, 245, 245, 0.56) 67.25%, rgba(233, 233, 233, 0.00) 100%);
        top: 687px;
        left: 50%;
    }

    .poem-gradient3 {
        z-index: 1;
        position: absolute;
        top: 1025px;
        width: 1769px;
        height: 1547px;
        left: -20%;
        border-radius: 1769px;
        background: radial-gradient(50.35% 50.24% at 46.09% 49.91%, #FFF 0%, rgba(245, 245, 245, 0.56) 77.71%, rgba(233, 233, 233, 0.00) 100%);
    }

    .poem-gradient4 {
        z-index: 0;
        position: absolute;
        top: 1500px;
        right: -5%;
        width: 2396px;
        height: 1252px;
        border-radius: 2396px;
        background: radial-gradient(50.35% 50.24% at 46.09% 49.91%, #BFCDFF 0%, rgba(217, 221, 255, 0.92) 53.13%, rgba(233, 233, 233, 0.00) 100%);
    }

    .poem-gradient5 {
        z-index: 0;
        position: absolute;
        top: 1840px;
        left: 50%;
        width: 1576px;
        height: 1378px;
        border-radius: 1576px;
        background: radial-gradient(50% 50% at 50% 50%, #90D3F9 0%, rgba(144, 211, 249, 0.00) 100%);
    }

    .poem-gradient6 {
        z-index: 0;
        position: absolute;
        top: 2170px;
        left: -15%;
        width: 1576px;
        height: 1378px;
        border-radius: 1576px;
        background: radial-gradient(50.35% 50.24% at 46.09% 49.91%, #FFF 0%, rgba(245, 245, 245, 0.56) 67.25%, rgba(233, 233, 233, 0.00) 100%);
    }

    .poem-gradient7 {
        z-index: 0;
        position: absolute;
        top: 2900px;
        left: 50%;
        width: 1269px;
        height: 1167px;
        border-radius: 1269px;
        background: radial-gradient(50% 50% at 50% 50%, #94B8FE 0%, rgba(144, 211, 249, 0.00) 100%);
    }

    .poem-gradient8 {
        z-index: 0;
        position: absolute;
        bottom: 200px;
        left: -2%;
        width: 1761px;
        height: 1361px;
        border-radius: 1761px;
        background: radial-gradient(50.35% 50.24% at 46.09% 49.91%, #E4F7FF 0%, rgba(228, 243, 255, 0.56) 47.4%, rgba(233, 233, 233, 0.00) 100%);
    }

    .wave, .wave-resp {
        width: 100%;
        /*position: absolute;*/
        /*bottom: 0;*/
    }

    .wave-resp {
        display: none;
    }

    .landing-footer {
        position: relative;
        bottom: 0
    }

    .landing-footer .landing-logo {
        position: absolute;
        width: 100%;
        height: calc(100% - 3.4vw);
        left: calc(10px + 2.390625vw);
        padding: 0;
        bottom: 0;
    }

    .landing-footer .landing-logo img {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
    }

    .launch-button.bottom {
        padding: 10px 45px;
    }

    .set-up {
        margin-bottom: 20vw;
    }

    .read-more {
        white-space: nowrap;
    }


    @media only screen and (max-width: 920px) {
        .landing-head {
            padding-left: 8vw;
            padding-right: 8vw;
            background: none;
        }

        .globe-container {
            flex-direction: column;
            max-width: 680px;
            align-items: center;
            margin-top: 0;
            display: flex;
            width: 100%;
            justify-content: space-between;
        }

        .poems {
            max-width: 74vw;
            margin-right: auto;
            margin-left: auto;
            margin-top: 80px;
        }

        .text {
            padding-left: 0;
            padding-right: 0;
            width: 85%;
            padding-top: 180px;
            position: unset;
        }

        .globe {
            display: flex;
            margin-right: 0;
            align-items: center;
            justify-content: center;
        }

        .globe img {
            width: 488px;
            height: 488px;
        }

        #launch-button-1,
        #launch-button-2 {
            display: none;
        }

        .groups {
            gap: 30vw;
        }

        .group-item {
            width: 100%;
        }

        .group-text {
            position: unset;
            max-width: 100%;
            border-radius: 20px 0 20px 20px;
            margin-top: 36px;
            padding: 0 10px 70px 10px
        }

        .group-info {
            margin-bottom: 56px;
            padding-left: unset;
            padding-right: unset;
            max-width: 455px;
        }

        .group-title-resp {
            display: block;
        }

        .group-title {
            display: none;
        }

        .group-icon {
            top: 0;
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
        }

        .group-icon-left {
            left: 0;
        }

        .group-icon-right {
            left: 0;
        }

        .investors-hero {
            border-radius: 20px 20px 0 0;
            margin-top: 55px;
        }

        .group-hero:not(.investors-hero) {
            transform: unset;
            border-radius: 20px 20px 0 0;
        }

        .text-white {
            background: unset;
            background-clip: unset;
            -webkit-background-clip: unset;
            -webkit-text-fill-color: unset;
        }

        .transparency {
            width: 78%;
            font-size: calc(16px + 0.390625vw);
            padding: 20px;
        }

        .setting-up-flow {
            gap: 65px
        }

        .wave-resp {
            display: block;
        }

        .wave {
            display: none;
        }

        .poem-gradient-resp-1 {
            display: block;
            z-index: 0;
            position: absolute;
            top: 0;
            left: 0;
            width: 1440px;
            height: 645px;
            background: linear-gradient(176deg, #6F5EA1 57.64%, #B5DCFF 87.27%);
        }

        .poem-gradient-resp-2 {
            display: block;
            z-index: 0;
            position: absolute;
            top: 0;
            left: 0;
            width: 3529px;
            height: 2625px;
        }

        .poem-gradient1 {
            top: 687px;
        }

        .flow .icon {
            width: 6vw;
            height: 6vw;
            top: calc(-50% - 6px)
        }

        .landing-footer .landing-logo {
            height: calc(100% - 5.4vw);
        }

        /*.landing-footer .landing-logo img{*/
        /*    position: absolute;*/
        /*    top: 50%;*/
        /*    transform: translate(0, -50%);*/
        /*}*/
    }

    @media only screen and (max-width: 430px) {
        .landing-head {
            padding-left: 5vw;
            padding-right: 5vw;
        }

        .poems {
            max-width: 95vw;
        }

        .group-icon-left, .group-icon-right {
            width: 55px;
            height: 55px;
            left: 20px;
        }

        .transparency {
            width: 95%;
            padding: 15px 15px 35px 40px;
            margin-bottom: 45vw;
            flex-direction: column;
            align-items: flex-start;
            gap:30px
        }

        .transparency .right {
            width: 100%;
        }

        .transparency .right .eye{
            position: absolute;
            right: 45px;
            top: 25px;
        }

        .setting-up-flow {
            gap: 0;
        }

        .flow {
            width: 33.3%;
            display: flex;
            justify-content: center;
        }

        .flow .icon {
            width: 8vw;
            height: 8vw;
            font-size: 3.3vw;
        }

        .text .title {
            font-size: 36px;
        }

        .text .info, .text .info span {
            font-size: 25px;
        }

        .group-title-resp {
            font-size: 35px;
            line-height: 36px;
        }

        .group-info {
            font-size: 20px;
            line-height: 35px;
            padding-left: 10px;
            padding-right: 10px;
            margin-bottom: 36px;
        }

        .group-text {
            padding-bottom: 36px;
        }

        .launch-button {
            font-size: 25px;
        }

        .flow-text {
            font-size: 20px;
            flex-direction: column-reverse;
            margin-top: 30px
        }

        .flow-text svg {
            width: 30px;
        }

        .flow .icon {
            top: calc(-50% + 10px)
        }

        .set-up {
            margin-bottom: 45vw;
        }
    }

</style>