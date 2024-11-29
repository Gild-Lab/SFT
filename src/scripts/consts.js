import {ethers} from "ethers";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const TEST_CONTRACT_ADDRESS = "0x1cf0ab6cf30a8aea01e82cd6d831845fec4363a3";

export const ONE = ethers.BigNumber.from("1000000000000000000");
export const ROLES = [
    {roleName: "CERTIFIER", roleHash: "0xd646ae07eb0d0f77457502a65e7407930dff4cd4fd99abc6aac87a753f4c8a42", roleHolders:[]},
    {roleName: "CERTIFIER_ADMIN", roleHash: "0x4bbeb6fd3e5222e55f2f8b0c35bc228e0a06a25d0da772fdb02c3b92fa004f88", roleHolders:[]},
    {roleName: "CONFISCATOR", roleHash: "0xa49d0f1c9ff1006cadfa9c5663622056113f1b69c0f273e4a1e170ee907cde94", roleHolders:[]},
    {roleName: "CONFISCATOR_ADMIN", roleHash: "0xc23bede8eabca44a15d0193051ac5429f3d014a7e297a4e78f67d06657d14269", roleHolders:[]},
    {roleName: "DEPOSITOR", roleHash: "0xe16b3d8fc79140c62874442c8b523e98592b429e73c0db67686a5b378b29f336", roleHolders:[]},
    {roleName: "DEPOSITOR_ADMIN", roleHash: "0xc091f023e1c6780346fd5f1017395079a3ea0e07d94a4f9e7273a43e3fa2a7e8", roleHolders:[]},
    {roleName: "ERC1155TIERER", roleHash: "0x4050867f5f2e7b09df27b54fd9dd2dc48115dba018cf621a03355f7966666ae0", roleHolders:[]},
    {roleName: "ERC1155TIERER_ADMIN", roleHash: "0xd461edcf12d14f5a18f27560fb18cfcb7df6fedb1d46c3664b9634623e9a172d", roleHolders:[]},
    {roleName: "ERC20SNAPSHOTTER", roleHash: "0x2c95f646d7033c5b1f0ff0b069bf367786555798c4a6d29fdd04e5009fe72543", roleHolders:[]},
    {roleName: "ERC20SNAPSHOTTER_ADMIN", roleHash: "0xda44ae5b31a7809c0f15e7306bdde44fffb60fdee235af40c70b73a6610de41e", roleHolders:[]},
    {roleName: "ERC20TIERER", roleHash: "0x9f5e37ff3a64b04b72b5b1811abfcf4517dd143202c8aa61348ea257fa96a082", roleHolders:[]},
    {roleName: "ERC20TIERER_ADMIN", roleHash: "0xc1a04980ce16d8574a4108b9f0a95358068379059fe211b7eb60a9f805237e60", roleHolders:[]},
    {roleName: "HANDLER", roleHash: "0xf40ec076ff2e3a403e1c18632267861d39085e7f359ca5665846f335632cf819", roleHolders:[]},
    {roleName: "HANDLER_ADMIN", roleHash: "0x4cbb985fecd7e86ede589f695f46f07d40afe7cb60f6049028c0b9a6bfaf649e", roleHolders:[]},
    {roleName: "WITHDRAWER", roleHash: "0x779b9d7b1cefd23059ce3e2b194efb3183a6685dd830e8cbb723b0cbeb982b28", roleHolders:[]},
    {roleName: "WITHDRAWER_ADMIN", roleHash: "0xf2491dcc230f29376998d72c6c3ea4cc17d3791c66e46b32ea439c19610d51db", roleHolders:[]}
]
export const IPFS_APIS = [
    "https://vb1.gildlab.xyz/api/v0/add?pin=true&to-files=", //Vishal
    "https://db1.gildlab.xyz/api/v0/add?pin=true&to-files=", //David A Box1
    "https://ipfs.dragonflysun.ge/api/v0/add?pin=true&to-files=", //Nino
]
export const IPFS_GETWAY = "https://ipfs.io/ipfs/"
export const MAGIC_NUMBERS = {
    /**
     * Prefixes every rain meta document
     */
    RAIN_META_DOCUMENT: BigInt(0xff0a89c674ee7874n),
    /**S
     * OA Schema
     */
    OA_SCHEMA: BigInt(0xffa8e8a9b9cf4a31n),
    /**
     * OA Hash list
     */
    OA_HASH_LIST: BigInt(0xff9fae3cc645f463n),
    /**
     * OA Structure
     */
    OA_STRUCTURE: BigInt(0xffc47a6299e8a911n),
    /**
     * OA Token image
     */
    OA_TOKEN_IMAGE: BigInt(0xff8cd2927c8c86cbn),
    /**
     * OA Token credential links
     */
    OA_TOKEN_CREDENTIAL_LINKS: BigInt(0xffbc38eb14ad2209n),
    /**
     * OA Token authors
     */
    AUTHORS_LIST: BigInt(0xffb2637608c09e38)
};

export const TRANSACTION_IN_PROGRESS_TEXT = "Transaction taking place, please wait."
export const VIEW_ON_EXPLORER_TEXT = "View transaction"
export const ROUTE_LABEL_MAP = new Map([
    ["#setup", "Setup new SFT"],
    ["#roles", "SFT roles"],
    ["#mint", "Mint/Redeem"],
    ["#list", "Home"],
    ["#members", "Members"],
    ["#audit-history", "Audit history"],
    ["#", "Home"],
    ["#asset-classes", "Asset class list"],
    ["#new-asset-class", "New asset class"],
    ["#receipt/:id", "Receipt"],
    ["#sft-create-success", "Sft created successfully"],
    ["#ipfs", "IPFS"],
    ["#manual", "Manual"],
    ["#asset-register", "Asset register"],
    ["#asset-information", "Asset information"],
    ["#token-overview", "Token overview"],
    ["#new-revision", "New revision"],
    ["#asset-history", "Asset history"],
    ["#change-comparison", "Change comparison"],
    ["#address-overview", "Address overview"],
    ["#knowledgebase", "Knowledgebase"]
]);

export const landingPages = ['', '/', '#', '#transparency', '#investors', '#issuers', '#curators','#auditors', '#case-studies']