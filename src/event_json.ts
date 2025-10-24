import type { EventData } from "./types";

/**
 * Converts an event to a plain object suitable for JSON.stringify().
 * @param event - Event to convert
 * @returns Plain object matching JSON structure
 */
function toJSON(event: EventData): object {
  return {
    id: event.id,
    pubkey: event.pubkey,
    created_at: event.created_at,
    kind: event.kind,
    tags: event.tags,
    content: event.content,
    sig: event.sig,
  };
}

/**
 * Parses an event from JSON data.
 * @param json - Parsed JSON object
 * @returns Event instance
 */
function fromJSON(json: any): EventData {
  return {
    id: json.id || "",
    pubkey: json.pubkey || "",
    created_at: json.created_at || 0,
    kind: json.kind || 0,
    tags: json.tags || [],
    content: json.content || "",
    sig: json.sig || "",
  };
}

export const EventJSON = {
  toJSON,
  fromJSON,
};
