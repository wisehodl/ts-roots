import { sha256 } from "@noble/hashes/sha2.js";
import type { EventData } from "./types";

/**
 * Serializes an event into canonical JSON array format for ID computation.
 * Returns: [0, pubkey, created_at, kind, tags, content]
 * @param event - Event to serialize
 * @returns Canonical JSON string
 */
function serialize(event: EventData): string {
  const serialized = [
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content,
  ];
  return JSON.stringify(serialized);
}

/**
 * Computes the event ID as a lowercase hex-encoded SHA-256 hash.
 * @param event - Event to compute ID for
 * @returns 64-character lowercase hexadecimal event ID
 */
function getID(event: EventData): string {
  const serialized = serialize(event);
  const hash = sha256(new TextEncoder().encode(serialized));
  return Buffer.from(hash).toString("hex");
}

export const EventID = {
  serialize,
  getID,
};
