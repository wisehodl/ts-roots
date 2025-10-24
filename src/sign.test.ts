import { describe, expect, test } from "vitest";

import { Sign } from "./sign";
import { testEvent, testSK } from "./util.test";

describe("Sign.sign", () => {
  test("produces correct signature", () => {
    const signature = Sign.sign(testEvent.id, testSK);
    expect(signature).toBe(testEvent.sig);
  });

  test("throws on invalid event ID", () => {
    expect(() => Sign.sign("thisisabadeventid", testSK)).toThrow(
      /hex string expected,.*/,
    );
  });

  test("throws on invalid private key", () => {
    expect(() => Sign.sign(testEvent.id, "thisisabadsecretkey")).toThrow(
      /hex string expected,.*/,
    );
  });
});
