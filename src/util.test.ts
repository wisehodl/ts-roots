import { test } from "vitest";

import type { Event } from "./events";

test("placeholder", () => {});

export const testSK =
  "f43a0435f69529f310bbd1d6263d2fbf0977f54bfe2310cc37ae5904b83bb167";
export const testPK =
  "cfa87f35acbde29ba1ab3ee42de527b2cad33ac487e80cf2d6405ea0042c8fef";

export const testEvent: Event = {
  id: "c7a702e6158744ca03508bbb4c90f9dbb0d6e88fefbfaa511d5ab24b4e3c48ad",
  pubkey: testPK,
  created_at: 1760740551,
  kind: 1,
  tags: [],
  content: "hello world",
  sig: "0fb7c1eaa867c4d16000587f2fb26c0b67e7e069f35d1acbb2d385a7813eb342418714a4c4fd4c04b9d7e2477e7a2208102ef536df09b79b84b8f3c41e8e5708",
};

export const testEventJSON = `{"id":"c7a702e6158744ca03508bbb4c90f9dbb0d6e88fefbfaa511d5ab24b4e3c48ad","pubkey":"cfa87f35acbde29ba1ab3ee42de527b2cad33ac487e80cf2d6405ea0042c8fef","created_at":1760740551,"kind":1,"tags":[],"content":"hello world","sig":"0fb7c1eaa867c4d16000587f2fb26c0b67e7e069f35d1acbb2d385a7813eb342418714a4c4fd4c04b9d7e2477e7a2208102ef536df09b79b84b8f3c41e8e5708"}`;
