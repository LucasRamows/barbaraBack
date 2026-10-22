import { normalizePhone, isValidPhone, formatPhone } from './phone-normalizer';

describe('PhoneNormalizer', () => {
  it('normalizes 11-digit mobile phone', () => {
    expect(normalizePhone('(11) 98765-4321')).toBe('11987654321');
  });

  it('normalizes 10-digit landline phone', () => {
    expect(normalizePhone('11 3456-7890')).toBe('1134567890');
  });

  it('returns null for invalid lengths or empty inputs', () => {
    expect(normalizePhone(null)).toBeNull();
    expect(normalizePhone('')).toBeNull();
    expect(normalizePhone('123')).toBeNull();
    expect(normalizePhone('1234567890123')).toBeNull();
  });

  it('validates phone', () => {
    expect(isValidPhone('(11) 99999-0000')).toBe(true);
    expect(isValidPhone('invalid')).toBe(false);
  });

  it('formats digits back into human-readable phone', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    expect(formatPhone('1134567890')).toBe('(11) 3456-7890');
  });
});
