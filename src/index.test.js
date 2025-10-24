import { describe, expect, test } from "vitest";

import * as Roots from "./index";

describe("Package Exports", () => {
  test("exports type definitions", () => {
    // Types aren't runtime values, but we can check the module has them
    expect(Roots).toBeDefined();
  });

  test("exports constants", () => {
    expect(Roots.HEX_64_PATTERN).toBeDefined();
    expect(Roots.HEX_128_PATTERN).toBeDefined();
  });

  test("exports error classes", () => {
    expect(Roots.MalformedPubKeyError).toBeDefined();
    expect(Roots.MalformedPrivKeyError).toBeDefined();
    expect(Roots.MalformedIDError).toBeDefined();
    expect(Roots.MalformedSigError).toBeDefined();
    expect(Roots.MalformedTagError).toBeDefined();
    expect(Roots.FailedIDCompError).toBeDefined();
    expect(Roots.NoEventIDError).toBeDefined();
    expect(Roots.InvalidSigError).toBeDefined();
  });

  test("exports Keys namespace", () => {
    expect(Roots.Keys).toBeDefined();
    expect(Roots.Keys.generatePrivateKey).toBeTypeOf("function");
    expect(Roots.Keys.getPublicKey).toBeTypeOf("function");
  });

  test("exports Event namespace", () => {
    expect(Roots.Event).toBeDefined();
    expect(Roots.Event.serialize).toBeTypeOf("function");
    expect(Roots.Event.getID).toBeTypeOf("function");
    expect(Roots.Event.sign).toBeTypeOf("function");
    expect(Roots.Event.validate).toBeTypeOf("function");
    expect(Roots.Event.validateStructure).toBeTypeOf("function");
    expect(Roots.Event.validateID).toBeTypeOf("function");
    expect(Roots.Event.validateSignature).toBeTypeOf("function");
    expect(Roots.Event.toJSON).toBeTypeOf("function");
    expect(Roots.Event.fromJSON).toBeTypeOf("function");
  });

  test("exports Filter namespace", () => {
    expect(Roots.Filter).toBeDefined();
    expect(Roots.Filter.matches).toBeTypeOf("function");
    expect(Roots.Filter.toJSON).toBeTypeOf("function");
    expect(Roots.Filter.fromJSON).toBeTypeOf("function");
  });
});
