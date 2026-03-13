import { describe, it, expect, beforeEach } from 'vitest';
import { ContextStore } from '../src/context/ContextStore'; // Adjust path if necessary

describe('ContextStore', () => {
  let context: ContextStore;

  beforeEach(() => {
    context = new ContextStore();
  });

  describe('Basic Operations', () => {
    it('should store and retrieve basic values', () => {
      context.put('username', 'testuser');
      expect(context.get('username')).toBe('testuser');
    });

    it('should ignore null or undefined keys and values on put', () => {
      context.put('validKey', null);
      context.put(null as any, 'validValue');
      
      expect(context.has('validKey')).toBe(false);
      expect(context.has('null')).toBe(false);
    });

    it('should return default value if key is not found', () => {
      expect(context.get('missingKey', 'defaultValue')).toBe('defaultValue');
    });

    it('should correctly report if it has a key', () => {
      context.put('myKey', 'myValue');
      expect(context.has('myKey')).toBe(true);
      expect(context.has('otherKey')).toBe(false);
    });
  });

  describe('Type Casting & Parsing', () => {
    it('should correctly parse boolean values', () => {
      context.put('boolTrue', true);
      context.put('strTrue', 'true');
      context.put('strTrueUpper', 'TRUE');
      context.put('strFalse', 'false');
      context.put('randomStr', 'hello');

      expect(context.getBoolean('boolTrue')).toBe(true);
      expect(context.getBoolean('strTrue')).toBe(true);
      expect(context.getBoolean('strTrueUpper')).toBe(true);
      expect(context.getBoolean('strFalse')).toBe(false);
      expect(context.getBoolean('randomStr')).toBe(false);
    });

    it('should return default boolean if key is missing or undefined', () => {
      expect(context.getBoolean('missingBool', true)).toBe(true);
    });

    it('should correctly parse numeric values', () => {
      context.put('numObj', 42);
      context.put('strNum', '100');
      context.put('invalidNum', 'not-a-number');

      expect(context.getNumber('numObj')).toBe(42);
      expect(context.getNumber('strNum')).toBe(100);
      expect(context.getNumber('invalidNum', -1)).toBe(-1); // Fallback to default
    });

    it('should return default number if key is missing', () => {
      expect(context.getNumber('missingNum', 99)).toBe(99);
    });
  });

  describe('Deletion and Clearing', () => {
    it('should remove a specific key', () => {
      context.put('tempKey', 'tempValue');
      context.remove('tempKey');
      expect(context.has('tempKey')).toBe(false);
      expect(context.get('tempKey')).toBeUndefined();
    });

    it('should clear all stored keys', () => {
      context.put('key1', 'val1');
      context.put('key2', 'val2');
      
      context.clear();
      
      expect(context.has('key1')).toBe(false);
      expect(context.has('key2')).toBe(false);
      expect(context.entries().length).toBe(0);
    });
  });

  describe('Bulk Operations & Iteration', () => {
    it('should merge plain objects successfully', () => {
      context.put('existingKey', 'existing');
      
      context.merge({
        newKey1: 'val1',
        newKey2: 2
      });

      expect(context.get('existingKey')).toBe('existing');
      expect(context.get('newKey1')).toBe('val1');
      expect(context.getNumber('newKey2')).toBe(2);
    });

    it('should merge Maps successfully', () => {
      const mapStore = new Map();
      mapStore.set('mapKey', 'mapVal');
      
      context.merge(mapStore);
      
      expect(context.get('mapKey')).toBe('mapVal');
    });

    it('should return all entries for iteration', () => {
      context.put('a', 1);
      context.put('b', 2);

      const entries = context.entries();
      expect(entries).toEqual([
        ['a', 1],
        ['b', 2]
      ]);
    });

    it('should return a Set of all keys', () => {
      context.put('first', 'data');
      context.put('second', 'data');

      const keys = context.items();
      expect(keys).toBeInstanceOf(Set);
      expect(keys.has('first')).toBe(true);
      expect(keys.has('second')).toBe(true);
      expect(keys.size).toBe(2);
    });
  });
});