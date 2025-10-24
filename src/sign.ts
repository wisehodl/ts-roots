import { hashes as secp_hashes } from "@noble/secp256k1";
import { schnorr } from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { MalformedIDError, MalformedPrivKeyError } from "./errors";

secp_hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);
secp_hashes.sha256 = sha256;

/**
 * Generates a Schnorr signature for the given event ID using the provided private key.
 * @param eventID - 64-character lowercase hexadecimal event ID
 * @param privateKey - 64-character lowercase hexadecimal private key
 * @returns 128-character lowercase hexadecimal signature
 * @throws {MalformedIDError} If event ID is not 64 hex characters
 * @throws {MalformedPrivKeyError} If private key is not 64 lowercase hex characters
 */
function sign(eventID: string, privateKey: string): string {
  const privateKeyBytes = Buffer.from(privateKey, "hex");
  if (privateKeyBytes.length !== 32) {
    throw new MalformedPrivKeyError();
  }

  const idBytes = Buffer.from(eventID, "hex");
  if (idBytes.length !== 32) {
    throw new MalformedIDError();
  }

  const auxRand = sha256(privateKeyBytes);
  const signature = schnorr.sign(idBytes, privateKeyBytes, auxRand);
  return Buffer.from(signature).toString("hex");
}

export const Sign = {
  sign,
};
