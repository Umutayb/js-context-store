// src/ContextStore.ts

/**
 * The ContextStore class provides storage for key-value pairs in tests.
 * Instantiate this per-test or inject it via Playwright fixtures.
 */
export class ContextStore {
  private store = new Map<string, any>();

  /**
   * Associates the specified value with the specified key.
   * If the key or value is null/undefined, the operation is skipped.
   */
  public put<T>(key: string, value: T): void {
    if (key != null && value != null) {
      this.store.set(key, value);
    }
  }

  /**
   * Retrieves the value associated with the specified key.
   * If the key is not present, the default value is returned.
   */
  public get<T>(key: string, defaultValue?: T): T  {
    if (!this.store.has(key)) {
      return defaultValue!;
    }
    return this.store.get(key) as T;
  }

  /**
   * Retrieves the boolean value associated with the specified key.
   * Returns true only if the string representation is "true" (case-insensitive) or a boolean true.
   */
  public getBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = this.store.get(key);
    if (value === undefined || value === null) return defaultValue;
    if (typeof value === 'boolean') return value;
    return String(value).toLowerCase() === 'true';
  }

  /**
   * Retrieves the numeric value associated with the specified key.
   * Returns the defaultValue if parsing fails or key is missing.
   */
  public getNumber(key: string, defaultValue: number = 0): number {
    const value = this.store.get(key);
    if (value === undefined || value === null) return defaultValue;
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
   * Returns an array of key-value pairs, useful for iteration.
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