import { describe, test, expect } from "vitest";
import { Sign } from "./sign";
import { testSK, testEvent } from "./util.test";

describe("Sign.sign", () => {
  test("produces correct signature", () => {
    const signature = Sign.sign(testEvent.id, testSK);
    expect(signature).toBe(testEvent.sig);
  });

  test("throws on invalid event ID", () => {
    expect(() => Sign.sign("thisisabadeventid", testSK)).toThrow(
      "event id must be 64 hex characters",
    );
  });

  test("throws on invalid private key", () => {
    expect(() => Sign.sign(testEvent.id, "thisisabadsecretkey")).toThrow(
      "private key must be 64 lowercase hex characters",
    );
  });
});
