/**
 * Configures @noble/secp256k1 to use synchronous hash functions.
 * Required for Schnorr signing and verification operations.
 * Must be imported before any secp256k1 operations execute.
 */
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { hashes as secp_hashes } from "@noble/secp256k1";

secp_hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);
secp_hashes.sha256 = sha256;
