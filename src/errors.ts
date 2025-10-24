/**
 * Public key is not 64 lowercase hex characters.
 */
export class MalformedPubKeyError extends Error {
  constructor() {
    super("public key must be 64 lowercase hex characters");
    this.name = "MalformedPubKeyError";
  }
}

/**
 * Private key is not 64 lowercase hex characters.
 */
export class MalformedPrivKeyError extends Error {
  constructor() {
    super("private key must be 64 lowercase hex characters");
    this.name = "MalformedPrivKeyError";
  }
}

/**
 * Event ID is not 64 hex characters.
 */
export class MalformedIDError extends Error {
  constructor() {
    super("event id must be 64 hex characters");
    this.name = "MalformedIDError";
  }
}

/**
 * Event signature is not 128 hex characters.
 */
export class MalformedSigError extends Error {
  constructor() {
    super("event signature must be 128 hex characters");
    this.name = "MalformedSigError";
  }
}

/**
 * Event tag contains fewer than two elements.
 */
export class MalformedTagError extends Error {
  constructor() {
    super("tags must contain at least two elements");
    this.name = "MalformedTagError";
  }
}

/**
 * Event ID could not be computed during validation.
 */
export class FailedIDCompError extends Error {
  constructor() {
    super("failed to compute event id");
    this.name = "FailedIDCompError";
  }
}

/**
 * Event ID field is empty.
 */
export class NoEventIDError extends Error {
  constructor() {
    super("event id is empty");
    this.name = "NoEventIDError";
  }
}

/**
 * Event signature failed cryptographic validation.
 */
export class InvalidSigError extends Error {
  constructor() {
    super("event signature is invalid");
    this.name = "InvalidSigError";
  }
}
