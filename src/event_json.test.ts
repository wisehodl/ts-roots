import { describe, expect, test } from "vitest";

import { EventJSON } from "./event_json";
import type { EventData } from "./types";
import { testEvent, testEventJSON, testPK } from "./util.test";
import { Validate } from "./validate";

describe("Event JSON", () => {
  test("unmarshal event JSON", () => {
    const event = EventJSON.fromJSON(JSON.parse(testEventJSON));
    expect(() => Validate.validate(event)).not.toThrow();
    expectEqualEvents(event, testEvent);
  });

  test("marshal event JSON", () => {
    const eventJSON = JSON.stringify(EventJSON.toJSON(testEvent));
    expect(eventJSON).toBe(testEventJSON);
  });

  test("event JSON round trip", () => {
    const event: EventData = {
      id: "86e856d0527dd08527498cd8afd8a7d296bde37e4757a8921f034f0b344df3ad",
      pubkey: testPK,
      created_at: 1760740551,
      kind: 1,
      tags: [
        ["a", "value"],
        ["b", "value", "optional"],
        ["name", "value", "optional", "optional"],
      ],
      content: "hello world",
      sig: "c05fe02a9c082ff56aad2b16b5347498a21665f02f050ba086dbe6bd593c8cd448505d2831d1c0340acc1793eaf89b7c0cb21bb696c71da6b8d6b857702bb557",
    };

    const expectedJSON = `{"id":"86e856d0527dd08527498cd8afd8a7d296bde37e4757a8921f034f0b344df3ad","pubkey":"cfa87f35acbde29ba1ab3ee42de527b2cad33ac487e80cf2d6405ea0042c8fef","created_at":1760740551,"kind":1,"tags":[["a","value"],["b","value","optional"],["name","value","optional","optional"]],"content":"hello world","sig":"c05fe02a9c082ff56aad2b16b5347498a21665f02f050ba086dbe6bd593c8cd448505d2831d1c0340acc1793eaf89b7c0cb21bb696c71da6b8d6b857702bb557"}`;

    expect(() => Validate.validate(event)).not.toThrow();

    const eventJSON = JSON.stringify(EventJSON.toJSON(event));
    expect(eventJSON).toBe(expectedJSON);

    const unmarshalledEvent = EventJSON.fromJSON(JSON.parse(eventJSON));
    expect(() => Validate.validate(unmarshalledEvent)).not.toThrow();
    expectEqualEvents(unmarshalledEvent, event);
  });
});

function expectEqualEvents(got: EventData, want: EventData): void {
  expect(got.id).toBe(want.id);
  expect(got.pubkey).toBe(want.pubkey);
  expect(got.created_at).toBe(want.created_at);
  expect(got.kind).toBe(want.kind);
  expect(got.content).toBe(want.content);
  expect(got.sig).toBe(want.sig);
  expect(got.tags).toEqual(want.tags);
}
