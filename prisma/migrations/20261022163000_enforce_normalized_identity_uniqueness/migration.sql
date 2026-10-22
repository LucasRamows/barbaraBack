-- Run `npm run audit:identities` and `npm run backfill:identities -- --apply`
-- before this migration in an existing environment. The checks below are a
-- final fail-safe and the fallback updates keep empty/fresh deployments safe.
BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "User"
    GROUP BY translate(
      lower(btrim("username")),
      'áàâãäåéèêëíìîïóòôõöúùûüçñ',
      'aaaaaaeeeeiiiiooooouuuucn'
    )
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'identity migration blocked: duplicate normalized usernames';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM (
      SELECT u."id", lower(btrim(source."email")) AS email
      FROM "User" u
      CROSS JOIN LATERAL (
        VALUES
          (u."email"),
          ((SELECT p."email" FROM "PersonalProfile" p WHERE p."userId" = u."id")),
          ((SELECT s."email" FROM "StudentProfile" s WHERE s."userId" = u."id"))
      ) AS source("email")
      WHERE nullif(btrim(source."email"), '') IS NOT NULL
    ) candidates
    GROUP BY "id"
    HAVING count(DISTINCT email) > 1
  ) THEN
    RAISE EXCEPTION 'identity migration blocked: a user has conflicting email sources';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM (
      SELECT lower(btrim(source."email")) AS email
      FROM "User" u
      CROSS JOIN LATERAL (
        VALUES
          (u."email"),
          ((SELECT p."email" FROM "PersonalProfile" p WHERE p."userId" = u."id")),
          ((SELECT s."email" FROM "StudentProfile" s WHERE s."userId" = u."id"))
      ) AS source("email")
      WHERE nullif(btrim(source."email"), '') IS NOT NULL
    ) candidates
    WHERE email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ) THEN
    RAISE EXCEPTION 'identity migration blocked: invalid email format';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM (
      SELECT
        u."id",
        lower(btrim(coalesce(
          nullif(u."email", ''),
          (SELECT p."email" FROM "PersonalProfile" p WHERE p."userId" = u."id"),
          (SELECT s."email" FROM "StudentProfile" s WHERE s."userId" = u."id")
        ))) AS email
      FROM "User" u
    ) selected
    WHERE email IS NOT NULL
    GROUP BY email
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'identity migration blocked: duplicate normalized emails';
  END IF;
END $$;

UPDATE "User"
SET
  "usernameNormalized" = translate(
    lower(btrim("username")),
    'áàâãäåéèêëíìîïóòôõöúùûüçñ',
    'aaaaaaeeeeiiiiooooouuuucn'
  ),
  "email" = lower(btrim(coalesce(
    nullif("email", ''),
    (SELECT p."email" FROM "PersonalProfile" p WHERE p."userId" = "User"."id"),
    (SELECT s."email" FROM "StudentProfile" s WHERE s."userId" = "User"."id")
  ))),
  "emailNormalized" = lower(btrim(coalesce(
    nullif("email", ''),
    (SELECT p."email" FROM "PersonalProfile" p WHERE p."userId" = "User"."id"),
    (SELECT s."email" FROM "StudentProfile" s WHERE s."userId" = "User"."id")
  )));

DROP INDEX IF EXISTS "User_usernameNormalized_idx";
DROP INDEX IF EXISTS "User_emailNormalized_idx";
CREATE UNIQUE INDEX "User_usernameNormalized_key" ON "User"("usernameNormalized");
CREATE UNIQUE INDEX "User_emailNormalized_key" ON "User"("emailNormalized");

COMMIT;
