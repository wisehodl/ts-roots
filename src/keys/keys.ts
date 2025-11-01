import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { schnorr } from "@noble/secp256k1";

/**
 * Generates a new random secp256k1 private key.
 * @returns 64-character lowercase hexadecimal string
 */
export function generatePrivateKey(): string {
  const { secretKey } = schnorr.keygen();
  return bytesToHex(secretKey);
}

/**
 * Derives the public key from a private key hex string.
 * @param privateKey - 64-character lowercase hexadecimal private key
 * @returns 64-character lowercase hexadecimal public key (x-coordinate only)
 * @throws {MalformedPrivKeyError} If private key is not 64 lowercase hex characters
 */
export function getPublicKey(privateKey: string): string {
  const privateKeyBytes = hexToBytes(privateKey);
  const publicKeyBytes = schnorr.getPublicKey(privateKeyBytes);

  return bytesToHex(publicKeyBytes);
}
