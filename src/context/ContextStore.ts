// src/ContextStore.ts

/**
 * The ContextStore class provides storage for key-value pairs in tests.
 * Instantiate this per-test or inject it via test fixtures.
 */
export class ContextStore {
  // Using 'any' here is pragmatic since a test context holds mixed data types
  private store = new Map<string, any>();

  /**
   * Associates the specified value with the specified key.
   * If the key or value is null/undefined, the operation is skipped.
   */
  public put(key: string, value: any): void {
    if (key != null && value != null) {
      this.store.set(key, value);
    }
  }

  /**
   * Retrieves the value associated with the specified key.
   * Prioritizes developer ergonomics by returning T directly, 
   * removing the need for non-null assertions (!) in test code.
   */
  public get<T = any>(key: string, defaultValue?: T): T {
    if (!this.store.has(key)) {
      return defaultValue as T;
    }
    return this.store.get(key) as T;
  }

  /**
   * Retrieves the boolean value associated with the specified key.
   * Returns true only if the string representation is "true" (case-insensitive) or a boolean true.
   */
  public getBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = this.store.get(key);
    if (value == null) return defaultValue; // checks both null and undefined
    if (typeof value === 'boolean') return value;
    return String(value).toLowerCase() === 'true';
  }

  /**
   * Retrieves the numeric value associated with the specified key.
   * Returns the defaultValue if parsing fails or key is missing.
   */
  public getNumber(key: string, defaultValue: number = 0): number {
    const value = this.store.get(key);
    if (value == null) return defaultValue;
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Removes the entry with the specified key.
   */
  public remove(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clears all key-value mappings.
   */
  public clear(): void {
    this.store.clear();
  }

  /**
   * Checks whether the store contains the specified key.
   */
  public has(key: string): boolean {
    return this.store.has(key);
  }

  /**
   * Merges records or other Maps into the ContextStore.
   */
  public merge(...sources: (Record<string, any> | Map<string, any>)[]): void {
    for (const source of sources) {
      if (source instanceof Map) {
        source.forEach((value, key) => this.put(key, value));
      } else {
        Object.entries(source).forEach(([key, value]) => this.put(key, value));
      }
    }
  }

  /**
   * Returns an array of key-value pairs, useful for iteration and bulk assertions.
   */
  public entries(): [string, any][] {
    return Array.from(this.store.entries());
  }

  /**
   * Returns a copy of the keys currently in the store.
   */
  public items(): Set<string> {
    return new Set(this.store.keys());
  }
}