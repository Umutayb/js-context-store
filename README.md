# Context Store

A lightweight, strongly-typed, and framework-agnostic utility for managing test state and contextual data across test steps.

When writing end-to-end (E2E) or integration tests, you often need to pass data generated in one step (like a dynamic ID, an extracted date, or an email address) to subsequent steps. `context-store` replaces messy plain JavaScript objects with a robust map-based API, providing safe type-casting, default values, and clean iteration.

## Installation

```bash
npm install context-store
```

## Why use context-store?

* **Type Safety:** Built-in TypeScript support ensures you know exactly what data you are retrieving.
* **Safe Parsing:** Methods like `getBoolean` and `getNumber` gracefully handle missing or malformed data with reliable fallbacks.
* **Framework Agnostic:** Works perfectly with Playwright, Cypress, WebdriverIO, Jest, Mocha, or Cucumber.
* **Clean Iteration:** Easily loop through stored key-value pairs for bulk assertions.

## Quick Start

```typescript
import { ContextStore } from 'context-store';

// Instantiate a new store for your test
const context = new ContextStore();

// Store data during a step
context.put('UserEmail', 'test@example.com');
context.put('IsSubscribed', true);
context.put('RetryCount', '3'); // Note: Stored as a string

// Retrieve data safely in later steps
const email = context.get('UserEmail');
const isSubscribed = context.getBoolean('IsSubscribed');
const retries = context.getNumber('RetryCount', 0); // Safely parsed to a number!

console.log(email); // 'test@example.com'

```

## API Reference

| Method | Description | Example |
| --- | --- | --- |
| **`put(key, value)`** | Associates a value with a specific key. Ignores null/undefined inputs. | `context.put('id', 123);` |
| **`get<T>(key, default?)`** | Retrieves a value, optionally falling back to a default if the key is missing. | `context.get<string>('name', 'N/A');` |
| **`getBoolean(key, default?)`** | Returns `true` if the stored value is a boolean true or the string `"true"`. | `context.getBoolean('isActive', false);` |
| **`getNumber(key, default?)`** | Parses and returns the value as a number. Falls back to default if parsing fails. | `context.getNumber('price', 0);` |
| **`has(key)`** | Returns `true` if the store contains the specified key. | `context.has('token');` |
| **`merge(...sources)`** | Merges properties from records or other Maps into the current store. | `context.merge({ a: 1, b: 2 });` |
| **`entries()`** | Returns an array of `[key, value]` pairs, perfect for loops and assertions. | `for (const [k, v] of context.entries())` |
| **`items()`** | Returns a `Set` of all keys currently in the store. | `context.items();` |
| **`remove(key)`** | Deletes a specific entry from the store. | `context.remove('temporaryId');` |
| **`clear()`** | Wipes all data from the store. | `context.clear();` |

## Advanced: Playwright Fixture Integration

Instead of instantiating `ContextStore` manually inside every single test, you can inject it automatically using Playwright Fixtures.

**1. Define the fixture (`fixtures.ts`):**

```typescript
import { test as base } from '@playwright/test';
import { ContextStore } from 'context-store';

type MyFixtures = {
  context: ContextStore;
};

export const test = base.extend<MyFixtures>({
  context: async ({}, use) => {
    // Creates a fresh store for every test run
    const store = new ContextStore();
    await use(store);
  },
});

```

**2. Use it in your tests (`example.spec.ts`):**

```typescript
import { test } from './fixtures';

test('My test using the context store', async ({ page, context }) => {
  await test.step('Generate Data', async () => {
    context.put('orderId', 'ORD-999');
  });

  await test.step('Verify Data', async () => {
    const orderId = context.get('orderId');
    // Proceed with assertions...
  });
});

```

## License

MIT
