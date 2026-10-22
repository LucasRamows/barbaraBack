export interface IdentityAuditRecord {
  id: string;
  username: string;
  emails: Array<{
    source: 'personalProfile' | 'studentProfile' | 'user';
    value: string | null | undefined;
  }>;
  document?: string | null;
}

export interface IdentityConflict {
  canonical: string;
  userIds: string[];
  values: string[];
}

export interface InvalidIdentityValue {
  userId: string;
  value: string;
  source: string;
  reason: string;
}

export interface IdentityAuditReport {
  scannedUsers: number;
  usernameConflicts: IdentityConflict[];
  emailConflicts: IdentityConflict[];
  invalidEmails: InvalidIdentityValue[];
  invalidDocuments: InvalidIdentityValue[];
  usersWithLegacyDocuments: number;
}

export function normalizeUsername(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeDocument(value: string): string {
  return value.replace(/\D/g, '');
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasRepeatedDigits(value: string): boolean {
  return /^(\d)\1+$/.test(value);
}

function isValidCpf(value: string): boolean {
  if (value.length !== 11 || hasRepeatedDigits(value)) return false;

  const digits = value.split('').map(Number);
  for (let position = 9; position <= 10; position += 1) {
    let sum = 0;
    for (let index = 0; index < position; index += 1) {
      sum += digits[index] * (position + 1 - index);
    }
    const remainder = (sum * 10) % 11;
    const expected = remainder === 10 ? 0 : remainder;
    if (digits[position] !== expected) return false;
  }
  return true;
}

function isValidCnpj(value: string): boolean {
  if (value.length !== 14 || hasRepeatedDigits(value)) return false;

  const digits = value.split('').map(Number);
  const calculateDigit = (baseLength: number) => {
    let weight = baseLength - 7;
    let sum = 0;
    for (let index = 0; index < baseLength; index += 1) {
      sum += digits[index] * weight;
      weight -= 1;
      if (weight === 1) weight = 9;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  return digits[12] === calculateDigit(12) && digits[13] === calculateDigit(13);
}

export function isValidDocument(value: string): boolean {
  const normalized = normalizeDocument(value);
  return normalized.length === 11
    ? isValidCpf(normalized)
    : normalized.length === 14 && isValidCnpj(normalized);
}

function collectConflicts(
  entries: Array<{ canonical: string; userId: string; value: string }>,
): IdentityConflict[] {
  const grouped = new Map<
    string,
    { userIds: Set<string>; values: Set<string> }
  >();

  for (const entry of entries) {
    const group = grouped.get(entry.canonical) ?? {
      userIds: new Set<string>(),
      values: new Set<string>(),
    };
    group.userIds.add(entry.userId);
    group.values.add(entry.value);
    grouped.set(entry.canonical, group);
  }

  return [...grouped.entries()]
    .filter(([, group]) => group.userIds.size > 1)
    .map(([canonical, group]) => ({
      canonical,
      userIds: [...group.userIds].sort(),
      values: [...group.values].sort(),
    }))
    .sort((left, right) => left.canonical.localeCompare(right.canonical));
}

export function auditIdentities(
  records: readonly IdentityAuditRecord[],
): IdentityAuditReport {
  const usernameEntries: Array<{
    canonical: string;
    userId: string;
    value: string;
  }> = [];
  const emailEntries: Array<{
    canonical: string;
    userId: string;
    value: string;
  }> = [];
  const invalidEmails: InvalidIdentityValue[] = [];
  const invalidDocuments: InvalidIdentityValue[] = [];
  let usersWithLegacyDocuments = 0;

  for (const record of records) {
    usernameEntries.push({
      canonical: normalizeUsername(record.username),
      userId: record.id,
      value: record.username,
    });

    for (const email of record.emails) {
      const raw = email.value?.trim();
      if (!raw) continue;
      const canonical = normalizeEmail(raw);
      if (!isValidEmail(canonical)) {
        invalidEmails.push({
          userId: record.id,
          value: raw,
          source: email.source,
          reason: 'invalid_format',
        });
        continue;
      }
      emailEntries.push({ canonical, userId: record.id, value: raw });
    }

    const document = record.document?.trim();
    if (document) {
      usersWithLegacyDocuments += 1;
      if (!isValidDocument(document)) {
        invalidDocuments.push({
          userId: record.id,
          value: document,
          source: 'legacy',
          reason: 'invalid_check_digits',
        });
      }
    }
  }

  return {
    scannedUsers: records.length,
    usernameConflicts: collectConflicts(usernameEntries),
    emailConflicts: collectConflicts(emailEntries),
    invalidEmails: invalidEmails.sort((a, b) => a.userId.localeCompare(b.userId)),
    invalidDocuments: invalidDocuments.sort((a, b) =>
      a.userId.localeCompare(b.userId),
    ),
    usersWithLegacyDocuments,
  };
}
