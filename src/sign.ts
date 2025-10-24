import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { schnorr } from "@noble/secp256k1";

import "./crypto_init";

/**
 * Generates a Schnorr signature for the given event ID using the provided private key.
 * @param eventID - 64-character lowercase hexadecimal event ID
 * @param privateKey - 64-character lowercase hexadecimal private key
 * @returns 128-character lowercase hexadecimal signature
 * @throws {MalformedIDError} If event ID is not 64 hex characters
 * @throws {MalformedPrivKeyError} If private key is not 64 lowercase hex characters
 */
function sign(eventID: string, privateKey: string): string {
  const privateKeyBytes = hexToBytes(privateKey);
  const idBytes = hexToBytes(eventID);

  const auxRand = sha256(privateKeyBytes);
  const signature = schnorr.sign(idBytes, privateKeyBytes, auxRand);
  return bytesToHex(signature);
}

export const Sign = {
  sign,
};
