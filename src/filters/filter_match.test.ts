import { readFileSync } from "fs";
import { describe, expect, test } from "vitest";

import type { Event } from "../events";
import type { Filter } from "./filter";
import { matches } from "./filter_match";

const testEvents: Event[] = JSON.parse(
  readFileSync("src/testdata/test_events.json", "utf-8"),
);

interface FilterTestCase {
  name: string;
  filter: Filter;
  expectedIDs: string[];
}

const filterTestCases: FilterTestCase[] = [
  {
    name: "empty filter",
    filter: {},
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "null id",
    filter: { ids: null },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "empty id",
    filter: { ids: [] },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "single id prefix",
    filter: { ids: ["e751d41f"] },
    expectedIDs: ["e751d41f"],
  },
  {
    name: "single full id",
    filter: {
      ids: ["e67fa7b84df6b0bb4c57f8719149de77f58955d7849da1be10b2267c72daad8b"],
    },
    expectedIDs: ["e67fa7b8"],
  },
  {
    name: "multiple id prefixes",
    filter: { ids: ["562bc378", "5e4c64f1"] },
    expectedIDs: ["562bc378", "5e4c64f1"],
  },
  {
    name: "no id match",
    filter: { ids: ["ffff"] },
    expectedIDs: [],
  },
  {
    name: "null author",
    filter: { authors: null },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "empty author",
    filter: { authors: [] },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "single author prefix",
    filter: { authors: ["d877e187"] },
    expectedIDs: ["e751d41f", "562bc378", "e67fa7b8"],
  },
  {
    name: "multiple author prefixes",
    filter: { authors: ["d877e187", "9e4b726a"] },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
    ],
  },
  {
    name: "single author full",
    filter: {
      authors: [
        "d877e187934bd942a71221b50ff2b426bd0777991b41b6c749119805dc40bcbe",
      ],
    },
    expectedIDs: ["e751d41f", "562bc378", "e67fa7b8"],
  },
  {
    name: "no author match",
    filter: { authors: ["ffff"] },
    expectedIDs: [],
  },
  {
    name: "null kind",
    filter: { kinds: null },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "empty kind",
    filter: { kinds: [] },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "single kind",
    filter: { kinds: [1] },
    expectedIDs: ["562bc378", "7a5d83d4", "4b03b69a"],
  },
  {
    name: "multiple kinds",
    filter: { kinds: [0, 2] },
    expectedIDs: [
      "e751d41f",
      "e67fa7b8",
      "5e4c64f1",
      "3a122100",
      "4a15d963",
      "d39e6f3f",
    ],
  },
  {
    name: "no kind match",
    filter: { kinds: [99] },
    expectedIDs: [],
  },
  {
    name: "null since",
    filter: { since: null },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "null until",
    filter: { until: null },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "until only",
    filter: { until: 3000 },
    expectedIDs: ["e751d41f", "562bc378", "e67fa7b8"],
  },
  {
    name: "time range",
    filter: { since: 4000, until: 6000 },
    expectedIDs: ["5e4c64f1", "7a5d83d4", "3a122100"],
  },
  {
    name: "outside time range",
    filter: { since: 10000 },
    expectedIDs: [],
  },
  {
    name: "null tag filter",
    filter: { tags: { e: null } },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "empty tag filter",
    filter: { tags: { e: [] } },
    expectedIDs: [
      "e751d41f",
      "562bc378",
      "e67fa7b8",
      "5e4c64f1",
      "7a5d83d4",
      "3a122100",
      "4a15d963",
      "4b03b69a",
      "d39e6f3f",
    ],
  },
  {
    name: "single letter tag filter: e",
    filter: {
      tags: {
        e: ["5c83da77af1dec6d7289834998ad7aafbd9e2191396d75ec3cc27f5a77226f36"],
      },
    },
    expectedIDs: ["562bc378"],
  },
  {
    name: "multiple tag matches",
    filter: {
      tags: {
        e: [
          "5c83da77af1dec6d7289834998ad7aafbd9e2191396d75ec3cc27f5a77226f36",
          "ae3f2a91b6c3d8f7e9a1c5b4d8f2e7a9b6c3d8f7e9a1c5b4d8f2e7a9b6c3d8f7",
        ],
      },
    },
    expectedIDs: ["562bc378", "3a122100"],
  },
  {
    name: "multiple tag matches - single event match",
    filter: {
      tags: {
        e: [
          "5c83da77af1dec6d7289834998ad7aafbd9e2191396d75ec3cc27f5a77226f36",
          "cb7787c460a79187d6a13e75a0f19240e05fafca8ea42288f5765773ea69cf2f",
        ],
      },
    },
    expectedIDs: ["562bc378"],
  },
  {
    name: "single letter tag filter: p",
    filter: {
      tags: {
        p: ["91cf9b32f3735070f46c0a86a820a47efa08a5be6c9f4f8cf68e5b5b75c92d60"],
      },
    },
    expectedIDs: ["e67fa7b8"],
  },
  {
    name: "multi letter tag filter",
    filter: { tags: { emoji: ["🌊"] } },
    expectedIDs: ["e67fa7b8"],
  },
  {
    name: "multiple tag filters",
    filter: {
      tags: {
        e: ["ae3f2a91b6c3d8f7e9a1c5b4d8f2e7a9b6c3d8f7e9a1c5b4d8f2e7a9b6c3d8f7"],
        p: ["3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d"],
      },
    },
    expectedIDs: ["3a122100"],
  },
  {
    name: "prefix tag filter",
    filter: { tags: { p: ["ae3f2a91"] } },
    expectedIDs: [],
  },
  {
    name: "unknown tag filter",
    filter: { tags: { z: ["anything"] } },
    expectedIDs: [],
  },
  {
    name: "combined author+kind tag filter",
    filter: { authors: ["d877e187"], kinds: [1, 2] },
    expectedIDs: ["562bc378", "e67fa7b8"],
  },
  {
    name: "combined kind+time range tag filter",
    filter: { kinds: [0], since: 2000, until: 7000 },
    expectedIDs: ["5e4c64f1", "4a15d963"],
  },
  {
    name: "combined author+tag tag filter",
    filter: { authors: ["e719e8f8"], tags: { power: ["fire"] } },
    expectedIDs: ["4a15d963"],
  },
  {
    name: "combined tag filter",
    filter: {
      authors: ["e719e8f8"],
      kinds: [0],
      since: 5000,
      until: 10000,
      tags: { power: ["fire"] },
    },
    expectedIDs: ["4a15d963"],
  },
];

describe("matches", () => {
  test.each(filterTestCases)("$name", ({ filter, expectedIDs }) => {
    const actualIDs = testEvents
      .filter((event) => matches(filter, event))
      .map((event) => event.id.slice(0, 8));

    expect(actualIDs).toEqual(expectedIDs);
  });
});

describe("matches - skip malformed tags", () => {
  test("skips malformed tags during tag matching", () => {
    const event: Event = {
      id: "test",
      pubkey: "test",
      created_at: 0,
      kind: 1,
      tags: [["malformed"], ["valid", "value"]],
      content: "",
      sig: "test",
    };
    const filter: Filter = {
      tags: { valid: ["value"] },
    };

    expect(matches(filter, event)).toBe(true);
  });
});
