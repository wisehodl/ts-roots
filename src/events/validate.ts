import { hexToBytes } from "@noble/hashes/utils.js";
import { schnorr } from "@noble/secp256k1";

import { HEX_64_PATTERN, HEX_128_PATTERN } from "../constants";
import "../crypto_init";
import {
  FailedIDCompError,
  InvalidSigError,
  MalformedIDError,
  MalformedPubKeyError,
  MalformedSigError,
  MalformedTagError,
  NoEventIDError,
} from "../errors";
import type { Event } from "./event";
import { getID } from "./id";

/**
 * Checks event field formats and lengths conform to protocol specification.
 * @throws {MalformedPubKeyError} If pubkey is not 64 lowercase hex characters
 * @throws {MalformedIDError} If id is not 64 hex characters
 * @throws {MalformedSigError} If sig is not 128 hex characters
 * @throws {MalformedTagError} If any tag has fewer than 2 elements
 */
export function validateStructure(event: Event): void {
  if (!HEX_64_PATTERN.test(event.pubkey)) {
    throw new MalformedPubKeyError();
  }

  if (!HEX_64_PATTERN.test(event.id)) {
    throw new MalformedIDError();
  }

  if (!HEX_128_PATTERN.test(event.sig)) {
    throw new MalformedSigError();
  }

  for (const tag of event.tags) {
    if (tag.length < 2) {
      throw new MalformedTagError();
    }
  }
}

/**
 * Verifies the event ID matches the computed hash of the serialized event.
 * @throws {FailedIDCompError} If ID computation fails
 * @throws {NoEventIDError} If event.id is empty
 * @throws {Error} If computed ID does not match stored ID
 */
export function validateID(event: Event): void {
  let computedID: string;
  try {
    computedID = getID(event);
  } catch (err) {
    throw new FailedIDCompError();
  }

  if (event.id === "") {
    throw new NoEventIDError();
  }

  if (computedID !== event.id) {
    throw new Error(
      `event id "${event.id}" does not match computed id "${computedID}"`,
    );
  }
}

/**
 * Verifies the cryptographic signature using Schnorr verification.
 * @throws {InvalidSigError} If signature verification fails
 */
export function validateSignature(event: Event): void {
  const idBytes = hexToBytes(event.id);
  const sigBytes = hexToBytes(event.sig);
  const pubkeyBytes = hexToBytes(event.pubkey);

  const isValid = schnorr.verify(sigBytes, idBytes, pubkeyBytes);

  if (!isValid) {
    throw new InvalidSigError();
  }
}

/**
 * Performs complete event validation: structure, ID, and signature.
 * @throws First validation error encountered
 */
export function validate(event: Event): void {
  validateStructure(event);
  validateID(event);
  validateSignature(event);
}
