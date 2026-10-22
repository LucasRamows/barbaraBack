import {
  auditIdentities,
  normalizeEmail,
  normalizeUsername,
  type IdentityAuditRecord,
  type IdentityAuditReport,
} from './identity-audit';

export interface IdentityBackfillRecord extends IdentityAuditRecord {
  usernameNormalized?: string | null;
  email?: string | null;
  emailNormalized?: string | null;
}

export interface IdentityBackfillChange {
  id: string;
  usernameNormalized: string;
  email: string | null;
  emailNormalized: string | null;
}

export interface IdentityBackfillPlan {
  scannedUsers: number;
  unchangedUsers: number;
  changes: IdentityBackfillChange[];
  audit: IdentityAuditReport;
  sourceConflicts: Array<{ userId: string; emails: string[] }>;
}

export class IdentityBackfillBlockedError extends Error {
  constructor(public readonly plan: IdentityBackfillPlan) {
    super('Identity backfill blocked by audit findings');
    this.name = 'IdentityBackfillBlockedError';
  }
}

function selectCanonicalEmail(record: IdentityBackfillRecord): {
  selected: string | null;
  conflict: string[] | null;
} {
  const candidates = [
    record.email,
    ...record.emails.map((entry) => entry.value),
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  const canonical = [...new Set(candidates.map(normalizeEmail))].sort();

  if (canonical.length > 1) {
    return { selected: null, conflict: canonical };
  }

  return { selected: canonical[0] ?? null, conflict: null };
}

export function buildIdentityBackfillPlan(
  records: readonly IdentityBackfillRecord[],
): IdentityBackfillPlan {
  const audit = auditIdentities(records);
  const sourceConflicts: Array<{ userId: string; emails: string[] }> = [];
  const changes: IdentityBackfillChange[] = [];

  for (const record of records) {
    const email = selectCanonicalEmail(record);
    if (email.conflict) {
      sourceConflicts.push({ userId: record.id, emails: email.conflict });
      continue;
    }

    const next: IdentityBackfillChange = {
      id: record.id,
      usernameNormalized: normalizeUsername(record.username),
      email: email.selected,
      emailNormalized: email.selected,
    };
    const currentEmail = record.email?.trim() || null;

    if (
      record.usernameNormalized !== next.usernameNormalized ||
      currentEmail !== next.email ||
      record.emailNormalized !== next.emailNormalized
    ) {
      changes.push(next);
    }
  }

  const plan: IdentityBackfillPlan = {
    scannedUsers: records.length,
    unchangedUsers: records.length - changes.length - sourceConflicts.length,
    changes,
    audit,
    sourceConflicts: sourceConflicts.sort((left, right) =>
      left.userId.localeCompare(right.userId),
    ),
  };

  if (
    audit.usernameConflicts.length > 0 ||
    audit.emailConflicts.length > 0 ||
    audit.invalidEmails.length > 0 ||
    sourceConflicts.length > 0
  ) {
    throw new IdentityBackfillBlockedError(plan);
  }

  return plan;
}

export async function applyIdentityBackfillInBatches(
  changes: readonly IdentityBackfillChange[],
  batchSize: number,
  applyBatch: (batch: readonly IdentityBackfillChange[]) => Promise<void>,
): Promise<number> {
  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new Error('batchSize must be a positive integer');
  }

  let applied = 0;
  for (let index = 0; index < changes.length; index += batchSize) {
    const batch = changes.slice(index, index + batchSize);
    await applyBatch(batch);
    applied += batch.length;
  }
  return applied;
}
