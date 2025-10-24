/**
 * Tag represents a single tag within an event as an array of strings.
 * The first element identifies the tag name, the second contains the value,
 * and subsequent elements are optional.
 */
export type Tag = string[];

/**
 * EventData represents a Nostr protocol event with its seven required fields.
 * All fields must be present for a valid event.
 */
export interface EventData {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: Tag[];
  content: string;
  sig: string;
}

/**
 * TagFilters maps tag names to arrays of values for tag-based filtering.
 * Keys correspond to tag names without the "#" prefix.
 */
export interface TagFilters {
  [tagName: string]: string[];
}

/**
 * FilterExtensions holds arbitrary additional filter fields as raw JSON values.
 * Allows custom filter extensions without modifying the core Filter type.
 */
export interface FilterExtensions {
  [key: string]: unknown;
}

/**
 * FilterData defines subscription criteria for events.
 * All conditions within a filter are applied with AND logic.
 */
export interface FilterData {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  since?: number;
  until?: number;
  limit?: number;
  tags?: TagFilters;
  extensions?: FilterExtensions;
}
