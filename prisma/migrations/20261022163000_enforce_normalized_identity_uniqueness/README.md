# Normalized identity rollout

For an existing environment, deploy the additive migration first, then run:

1. `npm run audit:identities`
2. Resolve every reported conflict or invalid value.
3. `npm run backfill:identities` (dry-run)
4. `npm run backfill:identities -- --apply --batch-size=100`
5. Run the apply command again and confirm `applied: 0`.
6. Apply `migration.sql` to enforce the unique indexes.

The migration repeats the conflict checks inside its transaction. If a check
fails, PostgreSQL rolls the migration back without leaving partial indexes or
identity updates.
