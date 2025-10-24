import { describe, test, expect } from "vitest";
import { Keys } from "./keys";
import { HEX_64_PATTERN } from "./constants";
import { testSK, testPK } from "./util.test";

describe("Keys.generatePrivate", () => {
  test("returns 64 hex characters", () => {
    const privateKey = Keys.generatePrivate();
    expect(privateKey).toMatch(HEX_64_PATTERN);
  });

  test("generates unique keys", () => {
    const key1 = Keys.generatePrivate();
    const key2 = Keys.generatePrivate();
    expect(key1).not.toBe(key2);
  });
});

describe("Keys.getPublic", () => {
  test("derives correct public key", () => {
    const publicKey = Keys.getPublic(testSK);
    expect(publicKey).toBe(testPK);
  });

  test("throws on invalid private key - too short", () => {
    expect(() => Keys.getPublic("abc123")).toThrow(
      "private key must be 64 lowercase hex characters",
    );
  });

  test("throws on invalid private key - non-hex", () => {
    expect(() =>
      Keys.getPublic(
        "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
      ),
    ).toThrow("private key must be 64 lowercase hex characters");
  });

  test("throws on invalid private key - uppercase", () => {
    expect(() =>
      Keys.getPublic(
        "F43A0435F69529F310BBD1D6263D2FBF0977F54BFE2310CC37AE5904B83BB167",
      ),
    ).toThrow("private key must be 64 lowercase hex characters");
  });
});
