/**
 * TagFilters maps tag names to arrays of values for tag-based filtering.
 * Keys correspond to tag names without the "#" prefix.
 */
export interface TagFilters {
  [tagName: string]: string[] | null;
}

/**
 * FilterExtensions holds arbitrary additional filter fields as raw JSON values.
 * Allows custom filter extensions without modifying the core Filter type.
 */
export interface FilterExtensions {
  [key: string]: unknown;
}

/**
 * Filter defines subscription criteria for events.
 * All conditions within a filter are applied with AND logic.
 */
export interface Filter {
  ids?: string[] | null;
  authors?: string[] | null;
  kinds?: number[] | null;
  since?: number | null;
  until?: number | null;
  limit?: number | null;
  tags?: TagFilters | null;
  extensions?: FilterExtensions | null;
}
