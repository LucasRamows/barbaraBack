/**
 * Normalizes Brazilian phone numbers by removing non-digits.
 * Validates standard 10-digit (landline with DDD) or 11-digit (mobile with DDD) format.
 */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw || !raw.trim()) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 11) {
    return null;
  }
  return digits;
}

export function isValidPhone(raw: string): boolean {
  return normalizePhone(raw) !== null;
}

export function formatPhone(digits: string): string {
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return digits;
}
