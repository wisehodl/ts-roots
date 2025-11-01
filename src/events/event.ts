/**
 * Tag represents a single tag within an event as an array of strings.
 * The first element identifies the tag name, the second contains the value,
 * and subsequent elements are optional.
 */
export type Tag = string[];

/**
 * Event represents a Nostr protocol event with its seven required fields.
 * All fields must be present for a valid event.
 */
export interface Event {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: Tag[];
  content: string;
  sig: string;
}
