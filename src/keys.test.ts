import { describe, expect, test } from "vitest";

import { Keys } from "./keys";
import { testPK, testSK } from "./util.test";

const HEX_64_PATTERN = /^[a-f0-9]{64}$/;

describe("Keys.generatePrivate", () => {
  test("returns 64 hex characters", () => {
    const privateKey = Keys.generatePrivateKey();
    expect(privateKey).toMatch(HEX_64_PATTERN);
  });

  test("generates unique keys", () => {
    const key1 = Keys.generatePrivateKey();
    const key2 = Keys.generatePrivateKey();
    expect(key1).not.toBe(key2);
  });
});

describe("Keys.getPublic", () => {
  test("derives correct public key", () => {
    const publicKey = Keys.getPublicKey(testSK);
    expect(publicKey).toBe(testPK);
  });

  test("throws on invalid private key - too short", () => {
    expect(() => Keys.getPublicKey("abc123")).toThrow(
      /"secret key" expected.*/,
    );
  });

  test("throws on invalid private key - non-hex", () => {
    expect(() =>
      Keys.getPublicKey(
        "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
      ),
    ).toThrow(/hex string expected,.*/);
  });
});
