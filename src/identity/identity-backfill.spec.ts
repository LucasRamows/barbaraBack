import {
  applyIdentityBackfillInBatches,
  buildIdentityBackfillPlan,
  IdentityBackfillBlockedError,
  type IdentityBackfillRecord,
} from './identity-backfill';

function record(
  overrides: Partial<IdentityBackfillRecord> = {},
): IdentityBackfillRecord {
  return {
    id: 'user-1',
    username: 'Maria.Silva',
    usernameNormalized: null,
    email: null,
    emailNormalized: null,
    emails: [{ source: 'studentProfile', value: 'Maria@Email.com ' }],
    ...overrides,
  };
}

describe('identity backfill', () => {
  it('plans normalized values and becomes a no-op when rerun', () => {
    const first = buildIdentityBackfillPlan([record()]);

    expect(first.changes).toEqual([
      {
        id: 'user-1',
        usernameNormalized: 'maria.silva',
        email: 'maria@email.com',
        emailNormalized: 'maria@email.com',
      },
    ]);

    const change = first.changes[0];
    const second = buildIdentityBackfillPlan([
      record({
        usernameNormalized: change.usernameNormalized,
        email: change.email,
        emailNormalized: change.emailNormalized,
      }),
    ]);

    expect(second.changes).toEqual([]);
    expect(second.unchangedUsers).toBe(1);
  });

  it('blocks duplicate canonical identities before producing writable work', () => {
    expect(() =>
      buildIdentityBackfillPlan([
        record(),
        record({
          id: 'user-2',
          username: 'MÃ¡ria.Silva',
          emails: [{ source: 'personalProfile', value: 'maria@email.com' }],
        }),
      ]),
    ).toThrow(IdentityBackfillBlockedError);

    try {
      buildIdentityBackfillPlan([
        record(),
        record({ id: 'user-2', username: 'maria.silva' }),
      ]);
    } catch (error) {
      expect(error).toBeInstanceOf(IdentityBackfillBlockedError);
      expect((error as IdentityBackfillBlockedError).plan.audit.usernameConflicts)
        .toHaveLength(1);
    }
  });

  it('applies complete batches and does not count a transaction that rolls back', async () => {
    const changes = buildIdentityBackfillPlan([
      record(),
      record({
        id: 'user-2',
        username: 'outro.usuario',
        emails: [{ source: 'studentProfile', value: 'outro@email.com' }],
      }),
    ]).changes;
    const persisted = new Map<string, string>();

    await expect(
      applyIdentityBackfillInBatches(changes, 2, async (batch) => {
        const snapshot = new Map(persisted);
        try {
          for (const change of batch) {
            persisted.set(change.id, change.usernameNormalized);
            if (change.id === 'user-2') throw new Error('simulated failure');
          }
        } catch (error) {
          persisted.clear();
          snapshot.forEach((value, key) => persisted.set(key, value));
          throw error;
        }
      }),
    ).rejects.toThrow('simulated failure');

    expect(persisted.size).toBe(0);
  });
});
