import { describe, expect, test } from "vitest";

import type { EventData } from "./types";
import { testEvent, testPK } from "./util.test";
import { EventValidation } from "./validate";

interface ValidateEventTestCase {
  name: string;
  event: EventData;
  expectedError: string;
}

const structureTestCases: ValidateEventTestCase[] = [
  {
    name: "empty pubkey",
    event: {
      ...testEvent,
      pubkey: "",
    },
    expectedError: "public key must be 64 lowercase hex characters",
  },
  {
    name: "short pubkey",
    event: {
      ...testEvent,
      pubkey: "abc123",
    },
    expectedError: "public key must be 64 lowercase hex characters",
  },
  {
    name: "long pubkey",
    event: {
      ...testEvent,
      pubkey:
        "c7a702e6158744ca03508bbb4c90f9dbb0d6e88fefbfaa511d5ab24b4e3c48adabc",
    },
    expectedError: "public key must be 64 lowercase hex characters",
  },
  {
    name: "non-hex pubkey",
    event: {
      ...testEvent,
      pubkey:
        "zyx-!2e6158744ca03508bbb4c90f9dbb0d6e88fefbfaa511d5ab24b4e3c48ad",
    },
    expectedError: "public key must be 64 lowercase hex characters",
  },
  {
    name: "uppercase pubkey",
    event: {
      ...testEvent,
      pubkey:
        "C7A702E6158744CA03508BBB4C90F9DBB0D6E88FEFBFAA511D5AB24B4E3C48AD",
    },
    expectedError: "public key must be 64 lowercase hex characters",
  },
  {
    name: "empty id",
    event: {
      ...testEvent,
      id: "",
    },
    expectedError: "id must be 64 hex characters",
  },
  {
    name: "short id",
    event: {
      ...testEvent,
      id: "abc123",
    },
    expectedError: "id must be 64 hex characters",
  },
  {
    name: "empty signature",
    event: {
      ...testEvent,
      sig: "",
    },
    expectedError: "signature must be 128 hex characters",
  },
  {
    name: "short signature",
    event: {
      ...testEvent,
      sig: "abc123",
    },
    expectedError: "signature must be 128 hex characters",
  },
  {
    name: "empty tag",
    event: {
      ...testEvent,
      tags: [[]],
    },
    expectedError: "tags must contain at least two elements",
  },
  {
    name: "single element tag",
    event: {
      ...testEvent,
      tags: [["a"]],
    },
    expectedError: "tags must contain at least two elements",
  },
  {
    name: "one good tag, one single element tag",
    event: {
      ...testEvent,
      tags: [["a", "value"], ["b"]],
    },
    expectedError: "tags must contain at least two elements",
  },
];

describe("EventValidation.validateStructure", () => {
  test.each(structureTestCases)("$name", ({ event, expectedError }) => {
    expect(() => EventValidation.validateStructure(event)).toThrow(
      expectedError,
    );
  });
});

describe("EventValidation.validateID", () => {
  test("detects ID mismatch", () => {
    const event: EventData = {
      ...testEvent,
      id: "7f661c2a3c1ed67dc959d6cd968d743d5e6e334313df44724bca939e2aa42c9e",
    };
    expect(() => EventValidation.validateID(event)).toThrow(
      "does not match computed id",
    );
  });
});

describe("EventValidation.validateSignature", () => {
  test("accepts valid signature", () => {
    expect(() => EventValidation.validateSignature(testEvent)).not.toThrow();
  });

  test("rejects invalid signature", () => {
    const event: EventData = {
      ...testEvent,
      sig: "9e43cbcf7e828a21c53fa35371ee79bffbfd7a3063ae46fc05ec623dd3186667c57e3d006488015e19247df35eb41c61013e051aa87860e23fa5ffbd44120482",
    };
    expect(() => EventValidation.validateSignature(event)).toThrow(
      "event signature is invalid",
    );
  });
});

interface ValidateSignatureTestCase {
  name: string;
  id: string;
  sig: string;
  pubkey: string;
  expectedError: string | RegExp;
}

const validateSignatureTestCases: ValidateSignatureTestCase[] = [
  {
    name: "bad event id",
    id: "badeventid",
    sig: testEvent.sig,
    pubkey: testEvent.pubkey,
    expectedError: /hex string expected.*/,
  },
  {
    name: "bad event signature",
    id: testEvent.id,
    sig: "badeventsignature",
    pubkey: testEvent.pubkey,
    expectedError: /hex string expected.*/,
  },
  {
    name: "bad public key",
    id: testEvent.id,
    sig: testEvent.sig,
    pubkey: "badpublickey",
    expectedError: /hex string expected.*/,
  },
  {
    name: "malformed event signature",
    id: testEvent.id,
    sig: "abc123",
    pubkey: testEvent.pubkey,
    expectedError: /"signature" expected.*/,
  },
  {
    name: "malformed public key",
    id: testEvent.id,
    sig: testEvent.sig,
    pubkey: "abc123",
    expectedError: /"publicKey" expected.*/,
  },
];

describe("EventValidation.validateSignature - malformed inputs", () => {
  test.each(validateSignatureTestCases)(
    "$name",
    ({ id, sig, pubkey, expectedError }) => {
      const event: EventData = { ...testEvent, id, sig, pubkey };
      expect(() => EventValidation.validateSignature(event)).toThrow(
        expectedError,
      );
    },
  );
});

describe("EventValidation.validate", () => {
  test("validates complete event", () => {
    const event: EventData = {
      id: "c9a0f84fcaa889654da8992105eb122eb210c8cbd58210609a5ef7e170b51400",
      pubkey: testPK,
      created_at: testEvent.created_at,
      kind: testEvent.kind,
      tags: [
        ["a", "value"],
        ["b", "value", "optional"],
      ],
      content: "valid event",
      sig: "668a715f1eb983172acf230d17bd283daedb2598adf8de4290bcc7eb0b802fdb60669d1e7d1104ac70393f4dbccd07e8abf897152af6ce6c0a75499874e27f14",
    };
    expect(() => EventValidation.validate(event)).not.toThrow();
  });
});
