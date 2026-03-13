# RAG Document: @civitas-cerebrum/context-store

**Metadata & Context**

* **Package Name:** `@civitas-cerebrum/context-store`
* **Domain:** Software Testing, End-to-End (E2E) Testing, Integration Testing, Test Automation.
* **Primary Purpose:** Managing test state and sharing contextual data (e.g., dynamic IDs, generated emails) across different steps within a test.
* **Supported Frameworks:** Playwright, Cypress, WebdriverIO, Jest, Mocha, Cucumber (Framework-agnostic).
* **Key Features:** Map-based API, TypeScript type safety, safe data parsing, default value fallbacks.
* **Installation Command:** `npm i @civitas-cerebrum/context-store`

## Overview

`@civitas-cerebrum/context-store` is a utility designed to solve the problem of passing generated data between test steps in automated testing. Instead of relying on loosely typed plain JavaScript objects, it provides a robust, map-based API `ContextStore` that ensures type safety and offers reliable fallback mechanisms for missing or malformed data.

## Core API Reference for ContextStore

The `ContextStore` class provides the following methods for state management:

* **`put(key: string, value: any): void`**
Stores a value associated with a key. Null or undefined values are safely ignored.
* **`get<T>(key: string, default?: T): T | undefined`**
Retrieves a stored value. Supports generic type casting `<T>`. Optionally accepts a default value if the key does not exist.
* **`getBoolean(key: string, default?: boolean): boolean`**
Retrieves a value and safely parses it to a boolean. Returns `true` only if the underlying value is strictly boolean `true` or the exact string `"true"`.
* **`getNumber(key: string, default?: number): number`**
Retrieves a value and safely parses it to a number. If the value cannot be parsed, it falls back to the provided default value.
* **`has(key: string): boolean`**
Returns `true` if the specific key exists in the store.
* **`merge(...sources: any[]): void`**
Merges properties from plain JavaScript records or other Maps directly into the current store instance.
* **`entries(): [string, any][]`**
Returns an iterable array of `[key, value]` pairs. Useful for bulk assertions or looping through test state.
* **`items(): Set<string>`**
Returns a `Set` containing all keys currently populated in the store.
* **`remove(key: string): void`**
Deletes the specific key and its associated value from the test state.
* **`clear(): void`**
Wipes all data from the store, resetting it to an empty state.

## Basic Usage Example

```typescript
// Import and instantiation
import { ContextStore } from '@civitas-cerebrum/context-store';
const context = new ContextStore();

// Writing data to the store
context.put('UserEmail', 'test@example.com');
context.put('RetryCount', '3'); // Note: Stored as string

// Reading data with safe parsing
const email = context.get('UserEmail'); // Returns 'test@example.com'
const retries = context.getNumber('RetryCount', 0); // Returns number 3
```