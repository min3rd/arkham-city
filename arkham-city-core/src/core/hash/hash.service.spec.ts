import { HashService } from './hash.service';

describe('HashService', () => {
  const testValue = 'test-value';
  const testKey = 'test-key';

  describe('hash and compare', () => {
    it('should hash a value', () => {
      const hashed = HashService.hash(testValue);
      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toEqual(testValue);
    });

    it('should correctly compare a value with its hash', () => {
      const hashed = HashService.hash(testValue);
      const result = HashService.compare(testValue, hashed);
      expect(result).toBe(true);
    });

    it('should return false when comparing with incorrect value', () => {
      const hashed = HashService.hash(testValue);
      const result = HashService.compare('wrong-value', hashed);
      expect(result).toBe(false);
    });
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt a value', () => {
      const encrypted = HashService.encrypt(testValue, testKey);
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toEqual(testValue);
    });

    it('should correctly decrypt an encrypted value', () => {
      const encrypted = HashService.encrypt(testValue, testKey);
      const decrypted = HashService.decrypt<string>(encrypted, testKey);
      expect(decrypted).toEqual(testValue);
    });

    it('should return null when decrypting with incorrect key', () => {
      const encrypted = HashService.encrypt(testValue, testKey);
      const decrypted = HashService.decrypt<string>(encrypted, 'wrong-key');
      expect(decrypted).toBeNull();
    });

    it('should handle complex objects', () => {
      const complexObject = {
        name: 'test',
        values: [1, 2, 3],
        nested: { prop: 'value' },
      };
      const encrypted = HashService.encrypt(complexObject, testKey);
      const decrypted = HashService.decrypt<typeof complexObject>(
        encrypted,
        testKey,
      );
      expect(decrypted).toEqual(complexObject);
    });
  });
});
