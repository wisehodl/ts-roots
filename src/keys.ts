import { schnorr } from "@noble/secp256k1";
import { HEX_64_PATTERN } from "./constants";
import { MalformedPrivKeyError } from "./errors";

/**
 * Generates a new random secp256k1 private key.
 * @returns 64-character lowercase hexadecimal string
 */
function generatePrivateKey(): string {
  const { secretKey } = schnorr.keygen();
  return Buffer.from(secretKey).toString("hex");
}

/**
 * Derives the public key from a private key hex string.
 * @param privateKey - 64-character lowercase hexadecimal private key
 * @returns 64-character lowercase hexadecimal public key (x-coordinate only)
 * @throws {MalformedPrivKeyError} If private key is not 64 lowercase hex characters
 */
function getPublicKey(privateKey: string): string {
  if (!HEX_64_PATTERN.test(privateKey)) {
    throw new MalformedPrivKeyError();
  }

  const privateKeyBytes = Buffer.from(privateKey, "hex");
  const publicKeyBytes = schnorr.getPublicKey(privateKeyBytes);

  return Buffer.from(publicKeyBytes).toString("hex");
}

export const Keys = {
  generatePrivateKey,
  getPublicKey,
};
