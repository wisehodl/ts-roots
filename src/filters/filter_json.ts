import type { Filter, TagFilters } from "./filter";

/**
 * Converts a filter to a plain object suitable for JSON.stringify().
 * Merges standard fields, tag filters (prefixed with #), and extensions.
 */
export function toJSON(filter: Filter): object {
  const output: Record<string, any> = {};

  // Standard fields
  if (filter.ids !== undefined) output.ids = filter.ids;
  if (filter.authors !== undefined) output.authors = filter.authors;
  if (filter.kinds !== undefined) output.kinds = filter.kinds;
  if (filter.since !== undefined) output.since = filter.since;
  if (filter.until !== undefined) output.until = filter.until;
  if (filter.limit !== undefined) output.limit = filter.limit;

  // Tag filters with # prefix
  if (filter.tags) {
    for (const [tagName, values] of Object.entries(filter.tags)) {
      output[`#${tagName}`] = values;
    }
  }

  // Extensions (block collisions with standard/tag fields)
  if (filter.extensions) {
    for (const [key, value] of Object.entries(filter.extensions)) {
      // Skip if collides with standard field
      if (
        ["ids", "authors", "kinds", "since", "until", "limit"].includes(key)
      ) {
        continue;
      }
      // Skip if starts with # (tag field collision)
      if (key.startsWith("#")) {
        continue;
      }
      output[key] = value;
    }
  }

  return output;
}

/**
 * Parses a filter from JSON data.
 * Separates standard fields, tag filters (keys starting with #), and extensions.
 */
export function fromJSON(json: any): Filter {
  const filter: Filter = {};
  const remaining: Record<string, any> = { ...json };

  // Extract standard fields
  if ("ids" in remaining) {
    filter.ids = remaining.ids;
    delete remaining.ids;
  }
  if ("authors" in remaining) {
    filter.authors = remaining.authors;
    delete remaining.authors;
  }
  if ("kinds" in remaining) {
    filter.kinds = remaining.kinds;
    delete remaining.kinds;
  }
  if ("since" in remaining) {
    filter.since = remaining.since === null ? undefined : remaining.since;
    delete remaining.since;
  }
  if ("until" in remaining) {
    filter.until = remaining.until === null ? undefined : remaining.until;
    delete remaining.until;
  }
  if ("limit" in remaining) {
    filter.limit = remaining.limit === null ? undefined : remaining.limit;
    delete remaining.limit;
  }

  // Extract tag filters (keys starting with #)
  const tags: TagFilters = {};
  for (const key in remaining) {
    if (key.startsWith("#")) {
      const tagName = key.slice(1);
      tags[tagName] = remaining[key];
      delete remaining[key];
    }
  }
  if (Object.keys(tags).length > 0) {
    filter.tags = tags;
  }

  // Remaining fields go to extensions
  if (Object.keys(remaining).length > 0) {
    filter.extensions = remaining;
  }

  return filter;
}
