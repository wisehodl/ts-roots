import type { EventData, FilterData, Tag, TagFilters } from "./types";

/**
 * Returns true if candidate starts with any prefix in the list.
 */
function matchesPrefix(candidate: string, prefixes: string[]): boolean {
  for (const prefix of prefixes) {
    if (candidate.startsWith(prefix)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns true if candidate exists in the kinds list.
 */
function matchesKinds(candidate: number, kinds: number[]): boolean {
  return kinds.includes(candidate);
}

/**
 * Returns true if timestamp falls within the optional since/until range.
 */
function matchesTimeRange(
  timestamp: number,
  since?: number | null,
  until?: number | null,
): boolean {
  if (since && timestamp < since) {
    return false;
  }
  if (until && timestamp > until) {
    return false;
  }
  return true;
}

/**
 * Returns true if event tags satisfy all tag filter requirements.
 * Skips tags with fewer than 2 elements during matching.
 */
function matchesTags(eventTags: Tag[], tagFilters: TagFilters): boolean {
  // Build index of tag names to their values
  const eventIndex = new Map<string, string[]>();
  for (const tag of eventTags) {
    if (tag.length < 2) continue;
    const tagName = tag[0];
    const tagValue = tag[1];
    if (!eventIndex.has(tagName)) {
      eventIndex.set(tagName, []);
    }
    eventIndex.get(tagName)!.push(tagValue);
  }

  // Check each filter requirement
  for (const [tagName, filterValues] of Object.entries(tagFilters)) {
    // Empty filter values match all events
    if (!filterValues || filterValues.length === 0) continue;

    const eventValues = eventIndex.get(tagName);
    if (!eventValues) return false;

    // Check if any filter value matches any event value (OR within tag)
    const found = filterValues.some((filterVal) =>
      eventValues.includes(filterVal),
    );

    if (!found) return false;
  }

  return true;
}

/**
 * Returns true if the event satisfies all filter conditions (AND logic).
 * Does not account for custom extensions.
 */
function matches(filter: FilterData, event: EventData): boolean {
  // Check ID prefixes
  if (filter.ids && filter.ids.length > 0) {
    if (!matchesPrefix(event.id, filter.ids)) {
      return false;
    }
  }

  // Check Author prefixes
  if (filter.authors && filter.authors.length > 0) {
    if (!matchesPrefix(event.pubkey, filter.authors)) {
      return false;
    }
  }

  // Check Kind
  if (filter.kinds && filter.kinds.length > 0) {
    if (!matchesKinds(event.kind, filter.kinds)) {
      return false;
    }
  }

  // Check Timestamp
  if (!matchesTimeRange(event.created_at, filter.since, filter.until)) {
    return false;
  }

  // Check Tags
  if (filter.tags && Object.keys(filter.tags).length > 0) {
    if (!matchesTags(event.tags, filter.tags)) {
      return false;
    }
  }

  return true;
}

export const FilterMatch = {
  matches,
};
