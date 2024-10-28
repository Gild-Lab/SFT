// src/wasmModule.js

import init, { concat_hex_addresses, cbor_encode_addresses, hex_to_bytes} from "../public/pkg/encoding_addresses.js";

let wasm;

async function initWasm() {
    wasm = await init();
}

export async function convertAddress(hexAddress) {
    if (!wasm) await initWasm();
    return concat_hex_addresses(hexAddress);
}
export async function encodeAddresses(hexAddress) {
    if (!wasm) await initWasm();
    return cbor_encode_addresses(hexAddress);
}

export async function hexToBytes(hexStr) {
    if (!wasm) await initWasm();
    return hex_to_bytes(hexStr);
}

export { initWasm };
