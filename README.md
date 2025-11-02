# TS-Roots - Nostr Protocol Library for TypeScript

Source: https://git.wisehodl.dev/jay/ts-roots

Mirror: https://github.com/wisehodl/ts-roots

## What this library does

`ts-roots` is a consensus-layer Nostr protocol library for TypeScript.
It only provides primitives that define protocol compliance:

- Event Structure
- Serialization
- Cryptographic Signatures
- Subscription Filters

## What this library does not do

`ts-roots` serves as a foundation for other libraries and applications to
implement higher level abstractions of the Nostr protocol on top of it,
including message transport, semantic event definitions, event storage
mechanisms, and user interfaces.

`ts-roots` prioritizes correctness and clarity over optimization and efficiency. For high performance applications, it is recommended to implement optimizations in a separate library or in the application which requires them.

## Installation

1. Add `ts-roots` to your project:

```bash
npm install @wisehodl/roots
```

2. Import it:

```typescript
import * as events from '@wisehodl/roots/events';
import * as filters from '@wisehodl/roots/filters';
import * as keys from '@wisehodl/roots/keys';
import * as constants from '@wisehodl/roots/constants';
import * as errors from '@wisehodl/roots/errors';

import type { Event } from '@wisehodl/roots/events';
import type { Filter } from '@wisehodl/roots/filters';
```

## Usage Examples

### Key Management

#### Generate a new keypair

```typescript
const privateKey = keys.generatePrivateKey();
const publicKey = keys.getPublicKey(privateKey);
```

#### Derive public key from existing private key

```typescript
const privateKey = "f43a0435f69529f310bbd1d6263d2fbf0977f54bfe2310cc37ae5904b83bb167";
const publicKey = keys.getPublicKey(privateKey);
// publicKey: "cfa87f35acbde29ba1ab3ee42de527b2cad33ac487e80cf2d6405ea0042c8fef"
```

---

### Event Creation and Signing

#### Create and sign a complete event

```typescript
// 1. Build the event structure
const event: Event = {
  pubkey: publicKey,
  created_at: Math.floor(Date.now() / 1000),
  kind: 1,
  tags: [
    ["e", "5c83da77af1dec6d7289834998ad7aafbd9e2191396d75ec3cc27f5a77226f36"],
    ["p", "91cf9b32f3735070f46c0a86a820a47efa08a5be6c9f4f8cf68e5b5b75c92d60"],
  ],
  content: "Hello, Nostr!",
  id: "",
  sig: "",
};

// 2. Compute the event ID
const id = events.getID(event);
event.id = id;

// 3. Sign the event
const sig = events.sign(id, privateKey);
event.sig = sig;
```

#### Serialize an event for ID computation

```typescript
// Returns canonical JSON: [0, pubkey, created_at, kind, tags, content]
const serialized = events.serialize(event);
```

#### Compute event ID manually

```typescript
const id = events.getID(event);
// Returns lowercase hex SHA-256 hash of serialized form
```

---

### Event Validation

#### Validate complete event

```typescript
// Checks structure, ID computation, and signature
try {
  events.validate(event);
} catch (err) {
  console.log(`Invalid event: ${err.message}`);
}
```

#### Validate individual aspects

```typescript
// Check field formats and lengths
try {
  events.validateStructure(event);
} catch (err) {
  console.log(`Malformed structure: ${err.message}`);
}

// Verify ID matches computed hash
try {
  events.validateID(event);
} catch (err) {
  console.log(`ID mismatch: ${err.message}`);
}

// Verify cryptographic signature
try {
  events.validateSignature(event);
} catch (err) {
  console.log(`Invalid signature: ${err.message}`);
}
```

---

### Event JSON

#### Marshal event to JSON

```typescript
const jsonString = JSON.stringify(events.toJSON(event));
// Standard JSON.stringify works with events.toJSON()
```

#### Unmarshal event from JSON

```typescript
const event = events.fromJSON(JSON.parse(jsonString));

// Validate after unmarshaling
try {
  events.validate(event);
} catch (err) {
  console.log(`Received invalid event: ${err.message}`);
}
```

---

### Filter Creation

#### Basic filter with standard fields

```typescript
const since = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
const limit = 50;

const filter: Filter = {
  ids: ["abc123", "def456"],  // Prefix match
  authors: ["cfa87f35"],      // Prefix match
  kinds: [1, 6, 7],
  since: since,
  limit: limit,
};
```

#### Filter with tag conditions

```typescript
const filter: Filter = {
  kinds: [1],
  tags: {
    e: ["5c83da77af1dec6d7289834998ad7aafbd9e2191396d75ec3cc27f5a77226f36"],
    p: ["91cf9b32f3735070f46c0a86a820a47efa08a5be6c9f4f8cf68e5b5b75c92d60"],
  },
};
```

#### Filter with extensions (custom fields)

```typescript
// Extensions allow arbitrary JSON fields beyond the standard filter spec.
// For example, this is how to implement non-standard filters like 'search'.
const filter: Filter = {
  kinds: [1],
  extensions: {
    search: "bitcoin",
  },
};

// Extensions are preserved during marshal/unmarshal but ignored by matches().
// Storage/transport layers can inspect extensions to implement custom behavior.
```

---

### Filter Matching

#### Match single event

```typescript
const filter: Filter = {
  authors: ["cfa87f35"],
  kinds: [1],
};

if (filters.matches(filter, event)) {
  // Event satisfies all filter conditions
}
```

#### Filter event collection

```typescript
const since = Math.floor(Date.now() / 1000) - (60 * 60);
const filter: Filter = {
  kinds: [1],
  since: since,
  tags: {
    p: ["abc123", "def456"],  // OR within tag values
  },
};

const matches = eventCollection.filter(event => filters.matches(filter, event));
```

---

### Filter JSON

#### Marshal filter to JSON

```typescript
const filter: Filter = {
  ids: ["abc123"],
  kinds: [1],
  tags: {
    e: ["event-id"],
  },
  extensions: {
    search: "nostr",
  },
};

const jsonString = JSON.stringify(filters.toJSON(filter));
// Result: {"ids":["abc123"],"kinds":[1],"#e":["event-id"],"search":"nostr"}
```

#### Unmarshal filter from JSON

```typescript
const jsonData = `{
  "authors": ["cfa87f35"],
  "kinds": [1],
  "#e": ["abc123"],
  "since": 1234567890,
  "search": "bitcoin"
}`;

const filter = filters.fromJSON(JSON.parse(jsonData));

// Standard fields populated: authors, kinds, since
// Tag filters populated: tags.e = ["abc123"]
// Unknown fields populated: extensions.search = "bitcoin"
```

#### Extensions field behavior

The `extensions` field captures any JSON properties not recognized as standard filter fields or tag filters. This design allows the core library to remain frozen while storage and transport layers implement custom filtering behavior.

**Standard fields**: `ids`, `authors`, `kinds`, `since`, `until`, `limit`

**Tag filters**: Any key starting with `#` (e.g., `#e`, `#p`, `#emoji`)

**Extensions**: Everything else

During marshaling, extensions merge into the output JSON. During unmarshaling, unrecognized fields populate extensions. The `matches()` method ignores extensions, and the library expects higher protocol layers to implement their usage.

Example implementing search filter:

```typescript
const filter: Filter = {
  kinds: [1],
  extensions: {
    search: "bitcoin",
  },
};

// In a storage layer (not this library):
if (filter.extensions?.search) {
  const searchTerm = filter.extensions.search as string;
  // Apply full-text search using searchTerm
}
```

## Testing

This library contains a comprehensive suite of unit tests. Run them with:

```bash
npm test
```

Or for a single run:

```bash
npm run test:run
```
