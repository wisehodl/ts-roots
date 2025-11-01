import { describe, expect, test } from "vitest";

import { testEvent, testSK } from "../util.test";
import { sign } from "./sign";

describe("sign", () => {
  test("produces correct signature", () => {
    const signature = sign(testEvent.id, testSK);
    expect(signature).toBe(testEvent.sig);
  });

  test("throws on invalid event ID", () => {
    expect(() => sign("thisisabadeventid", testSK)).toThrow(
      /hex string expected,.*/,
    );
  });

  test("throws on invalid private key", () => {
    expect(() => sign(testEvent.id, "thisisabadsecretkey")).toThrow(
      /hex string expected,.*/,
    );
  });
});
