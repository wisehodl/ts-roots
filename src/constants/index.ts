/**
 * Matches 64-character lowercase hexadecimal strings.
 * Used for validating event IDs and cryptographic keys.
 */
export const HEX_64_PATTERN = /^[a-f0-9]{64}$/;

/**
 * Matches 128-character lowercase hexadecimal strings.
 * Used for validating signatures.
 */
export const HEX_128_PATTERN = /^[a-f0-9]{128}$/;
