import { describe, expect, test } from "vitest";

import { FilterJSON } from "./filter_json";
import type { FilterData } from "./types";

interface FilterMarshalTestCase {
  name: string;
  filter: FilterData;
  expected: string;
}

interface FilterUnmarshalTestCase {
  name: string;
  input: string;
  expected: FilterData;
}

interface FilterRoundTripTestCase {
  name: string;
  filter: FilterData;
}

const marshalTestCases: FilterMarshalTestCase[] = [
  {
    name: "empty filter",
    filter: {},
    expected: "{}",
  },
  {
    name: "undefined IDs",
    filter: { ids: undefined },
    expected: "{}",
  },
  {
    name: "null IDs",
    filter: { ids: null },
    expected: '{"ids": null}',
  },
  {
    name: "empty IDs",
    filter: { ids: [] },
    expected: '{"ids":[]}',
  },
  {
    name: "populated IDs",
    filter: { ids: ["abc", "123"] },
    expected: '{"ids":["abc","123"]}',
  },
  {
    name: "undefined Authors",
    filter: { authors: undefined },
    expected: "{}",
  },
  {
    name: "null Authors",
    filter: { authors: null },
    expected: '{"authors": null}',
  },
  {
    name: "empty Authors",
    filter: { authors: [] },
    expected: '{"authors":[]}',
  },
  {
    name: "populated Authors",
    filter: { authors: ["abc", "123"] },
    expected: '{"authors":["abc","123"]}',
  },
  {
    name: "undefined Kinds",
    filter: { kinds: undefined },
    expected: "{}",
  },
  {
    name: "null Kinds",
    filter: { kinds: null },
    expected: '{"kinds": null}',
  },
  {
    name: "empty Kinds",
    filter: { kinds: [] },
    expected: '{"kinds":[]}',
  },
  {
    name: "populated Kinds",
    filter: { kinds: [1, 20001] },
    expected: '{"kinds":[1,20001]}',
  },
  {
    name: "undefined Since",
    filter: { since: undefined },
    expected: "{}",
  },
  {
    name: "null Since",
    filter: { since: null },
    expected: '{"since": null}',
  },
  {
    name: "populated Since",
    filter: { since: 1000 },
    expected: '{"since":1000}',
  },
  {
    name: "undefined Until",
    filter: { until: undefined },
    expected: "{}",
  },
  {
    name: "null Until",
    filter: { until: null },
    expected: '{"until": null}',
  },
  {
    name: "populated Until",
    filter: { until: 1000 },
    expected: '{"until":1000}',
  },
  {
    name: "undefined Limit",
    filter: { limit: undefined },
    expected: "{}",
  },
  {
    name: "null Limit",
    filter: { limit: null },
    expected: '{"limit": null}',
  },
  {
    name: "populated Limit",
    filter: { limit: 100 },
    expected: '{"limit":100}',
  },
  {
    name: "all standard fields",
    filter: {
      ids: ["abc", "123"],
      authors: ["def", "456"],
      kinds: [1, 200, 3000],
      since: 1000,
      until: 2000,
      limit: 100,
    },
    expected:
      '{"ids":["abc","123"],"authors":["def","456"],"kinds":[1,200,3000],"since":1000,"until":2000,"limit":100}',
  },
  {
    name: "mixed fields",
    filter: { ids: undefined, authors: [], kinds: [1] },
    expected: '{"authors":[],"kinds":[1]}',
  },
  {
    name: "undefined tags map",
    filter: { tags: undefined },
    expected: "{}",
  },
  {
    name: "null tags map",
    filter: { tags: null },
    expected: "{}",
  },
  {
    name: "single-letter tag",
    filter: { tags: { e: ["event1"] } },
    expected: '{"#e":["event1"]}',
  },
  {
    name: "multi-letter tag",
    filter: { tags: { emoji: ["🔥", "💧"] } },
    expected: '{"#emoji":["🔥","💧"]}',
  },
  {
    name: "null tag array",
    filter: { tags: { p: null } },
    expected: '{"#p":null}',
  },
  {
    name: "empty tag array",
    filter: { tags: { p: [] } },
    expected: '{"#p":[]}',
  },
  {
    name: "multiple tags",
    filter: {
      tags: {
        e: ["event1", "event2"],
        p: ["pubkey1", "pubkey2"],
      },
    },
    expected: '{"#e":["event1","event2"],"#p":["pubkey1","pubkey2"]}',
  },
  {
    name: "simple extension",
    filter: { extensions: { search: "query" } },
    expected: '{"search":"query"}',
  },
  {
    name: "extension with nested object",
    filter: { extensions: { meta: { author: "alice", score: 99 } } },
    expected: '{"meta":{"author":"alice","score":99}}',
  },
  {
    name: "extension with nested array",
    filter: { extensions: { items: [1, 2, 3] } },
    expected: '{"items":[1,2,3]}',
  },
  {
    name: "extension with complex nested structure",
    filter: { extensions: { data: { users: [{ id: 1 }], count: 5 } } },
    expected: '{"data":{"users":[{"id":1}],"count":5}}',
  },
  {
    name: "multiple extensions",
    filter: { extensions: { search: "x", depth: 3 } },
    expected: '{"search":"x","depth":3}',
  },
  {
    name: "extension collides with standard field - IDs",
    filter: { ids: ["real"], extensions: { ids: ["fake"] } },
    expected: '{"ids":["real"]}',
  },
  {
    name: "extension collides with standard field - Since",
    filter: { since: 100, extensions: { since: 999 } },
    expected: '{"since":100}',
  },
  {
    name: "extension collides with multiple standard fields",
    filter: {
      authors: ["a"],
      kinds: [1],
      extensions: { authors: ["b"], kinds: [2] },
    },
    expected: '{"authors":["a"],"kinds":[1]}',
  },
  {
    name: "extension collides with tag field - #e",
    filter: { extensions: { "#e": ["fakeevent"] } },
    expected: "{}",
  },
  {
    name: "extension collides with standard and tag fields",
    filter: {
      authors: ["realauthor"],
      tags: { e: ["realevent"] },
      extensions: { authors: ["fakeauthor"], "#e": ["fakeevent"] },
    },
    expected: '{"authors":["realauthor"],"#e":["realevent"]}',
  },
  {
    name: "filter with all field types",
    filter: {
      ids: ["x"],
      since: 100,
      tags: { e: ["y"] },
      extensions: { search: "z", ids: ["fakeid"] },
    },
    expected: '{"ids":["x"],"since":100,"#e":["y"],"search":"z"}',
  },
];

const unmarshalTestCases: FilterUnmarshalTestCase[] = [
  {
    name: "empty object",
    input: "{}",
    expected: {},
  },
  {
    name: "null IDs",
    input: '{"ids": null}',
    expected: { ids: null },
  },
  {
    name: "empty IDs",
    input: '{"ids": []}',
    expected: { ids: [] },
  },
  {
    name: "populated IDs",
    input: '{"ids": ["abc","123"]}',
    expected: { ids: ["abc", "123"] },
  },
  {
    name: "null Authors",
    input: '{"authors": null}',
    expected: { authors: null },
  },
  {
    name: "empty Authors",
    input: '{"authors": []}',
    expected: { authors: [] },
  },
  {
    name: "populated Authors",
    input: '{"authors": ["abc","123"]}',
    expected: { authors: ["abc", "123"] },
  },
  {
    name: "null Kinds",
    input: '{"kinds": null}',
    expected: { kinds: null },
  },
  {
    name: "empty Kinds",
    input: '{"kinds": []}',
    expected: { kinds: [] },
  },
  {
    name: "populated Kinds",
    input: '{"kinds": [1,2,3]}',
    expected: { kinds: [1, 2, 3] },
  },
  {
    name: "null Since",
    input: '{"since": null}',
    expected: { since: undefined },
  },
  {
    name: "populated Since",
    input: '{"since": 1000}',
    expected: { since: 1000 },
  },
  {
    name: "null Until",
    input: '{"until": null}',
    expected: { until: undefined },
  },
  {
    name: "populated Until",
    input: '{"until": 1000}',
    expected: { until: 1000 },
  },
  {
    name: "null Limit",
    input: '{"limit": null}',
    expected: { limit: undefined },
  },
  {
    name: "populated Limit",
    input: '{"limit": 1000}',
    expected: { limit: 1000 },
  },
  {
    name: "all standard fields",
    input:
      '{"ids":["abc","123"],"authors":["def","456"],"kinds":[1,200,3000],"since":1000,"until":2000,"limit":100}',
    expected: {
      ids: ["abc", "123"],
      authors: ["def", "456"],
      kinds: [1, 200, 3000],
      since: 1000,
      until: 2000,
      limit: 100,
    },
  },
  {
    name: "mixed fields",
    input: '{"ids": null, "authors": [], "kinds": [1]}',
    expected: { ids: null, authors: [], kinds: [1] },
  },
  {
    name: "zero int pointers",
    input: '{"since": 0, "until": 0, "limit": 0}',
    expected: { since: 0, until: 0, limit: 0 },
  },
  {
    name: "single-letter tag",
    input: '{"#e":["event1"]}',
    expected: { tags: { e: ["event1"] } },
  },
  {
    name: "multi-letter tag",
    input: '{"#emoji":["🔥","💧"]}',
    expected: { tags: { emoji: ["🔥", "💧"] } },
  },
  {
    name: "empty tag array",
    input: '{"#p":[]}',
    expected: { tags: { p: [] } },
  },
  {
    name: "multiple tags",
    input: '{"#p":["pubkey1","pubkey2"],"#e":["event1","event2"]}',
    expected: {
      tags: {
        p: ["pubkey1", "pubkey2"],
        e: ["event1", "event2"],
      },
    },
  },
  {
    name: "null tag",
    input: '{"#p":null}',
    expected: { tags: { p: null } },
  },
  {
    name: "simple extension",
    input: '{"search":"query"}',
    expected: { extensions: { search: "query" } },
  },
  {
    name: "extension with nested object",
    input: '{"meta":{"author":"alice","score":99}}',
    expected: { extensions: { meta: { author: "alice", score: 99 } } },
  },
  {
    name: "extension with nested array",
    input: '{"items":[1,2,3]}',
    expected: { extensions: { items: [1, 2, 3] } },
  },
  {
    name: "extension with complex nested structure",
    input: '{"data":{"level1":{"level2":[{"id":1}]}}}',
    expected: { extensions: { data: { level1: { level2: [{ id: 1 }] } } } },
  },
  {
    name: "multiple extensions",
    input: '{"search":"x","custom":true,"depth":3}',
    expected: { extensions: { search: "x", custom: true, depth: 3 } },
  },
  {
    name: "extension with null value",
    input: '{"optional":null}',
    expected: { extensions: { optional: null } },
  },
  {
    name: "kitchen sink",
    input: '{"ids":["x"],"since":100,"#e":["y"],"search":"z"}',
    expected: {
      ids: ["x"],
      since: 100,
      tags: { e: ["y"] },
      extensions: { search: "z" },
    },
  },
];

const roundTripTestCases: FilterRoundTripTestCase[] = [
  {
    name: "fully populated filter",
    filter: {
      ids: ["x"],
      since: 100,
      tags: { e: ["y"] },
      extensions: { search: "z" },
    },
  },
];

describe("FilterJSON.toJSON", () => {
  test.each(marshalTestCases)("$name", ({ filter, expected }) => {
    const result = JSON.stringify(FilterJSON.toJSON(filter));
    const expectedObj = JSON.parse(expected);
    const actualObj = JSON.parse(result);
    expect(actualObj).toEqual(expectedObj);
  });
});

describe("FilterJSON.fromJSON", () => {
  test.each(unmarshalTestCases)("$name", ({ input, expected }) => {
    const result = FilterJSON.fromJSON(JSON.parse(input));
    expectEqualFilters(result, expected);
  });
});

describe("FilterJSON round trip", () => {
  test.each(roundTripTestCases)("$name", ({ filter }) => {
    const jsonBytes = JSON.stringify(FilterJSON.toJSON(filter));
    const result = FilterJSON.fromJSON(JSON.parse(jsonBytes));
    expectEqualFilters(result, filter);
  });
});

function expectEqualFilters(got: FilterData, want: FilterData): void {
  expect(got.ids).toEqual(want.ids);
  expect(got.authors).toEqual(want.authors);
  expect(got.kinds).toEqual(want.kinds);
  expect(got.since).toEqual(want.since);
  expect(got.until).toEqual(want.until);
  expect(got.limit).toEqual(want.limit);
  expect(got.tags).toEqual(want.tags);
  expect(got.extensions).toEqual(want.extensions);
}
