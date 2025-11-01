import { describe, expect, test } from "vitest";

import { HEX_64_PATTERN } from "../constants";
import { testPK, testSK } from "../util.test";
import { generatePrivateKey, getPublicKey } from "./keys";

describe("generatePrivate", () => {
  test("returns 64 hex characters", () => {
    const privateKey = generatePrivateKey();
    expect(privateKey).toMatch(HEX_64_PATTERN);
  });

  test("generates unique keys", () => {
    const key1 = generatePrivateKey();
    const key2 = generatePrivateKey();
    expect(key1).not.toBe(key2);
  });
});

describe("getPublic", () => {
  test("derives correct public key", () => {
    const publicKey = getPublicKey(testSK);
    expect(publicKey).toBe(testPK);
  });

  test("throws on invalid private key - too short", () => {
    expect(() => getPublicKey("abc123")).toThrow(/"secret key" expected.*/);
  });

  test("throws on invalid private key - non-hex", () => {
    expect(() =>
      getPublicKey(
        "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
      ),
    ).toThrow(/hex string expected,.*/);
  });
});
