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
