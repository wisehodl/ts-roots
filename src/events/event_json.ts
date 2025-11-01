import type { Event } from "./event";

/**
 * Converts an event to a plain object suitable for JSON.stringify().
 * @param event - Event to convert
 * @returns Plain object matching JSON structure
 */
export function toJSON(event: Event): object {
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
export function fromJSON(json: any): Event {
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
