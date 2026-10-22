import { normalizeUsername } from './identity-audit';

/**
 * Maximum length for a generated username.
 * Keeps slugs short while leaving room for numeric suffixes.
 */
const MAX_USERNAME_LENGTH = 30;

/**
 * Maximum number of P2002 retries before giving up.
 */
const MAX_CONFLICT_RETRIES = 5;

/**
 * Derives a URL-safe slug from a display name.
 *
 * Steps:
 *   1. NFKD-normalize and strip diacritics (via `normalizeUsername`)
 *   2. Replace any run of non-alphanumeric characters with a single dot
 *   3. Trim leading/trailing dots
 *   4. Truncate to MAX_USERNAME_LENGTH
 *   5. Fallback to 'user' when input is blank or yields an empty slug
 */
export function slugifyName(name: string): string {
  const normalized = normalizeUsername(name);
  const slug = normalized
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .slice(0, MAX_USERNAME_LENGTH);

  return slug || 'user';
}

/**
 * Appends a numeric suffix to resolve collisions.
 *
 * Given 'maria.silva' and suffix 1, returns 'maria.silva1'.
 * If the result would exceed MAX_USERNAME_LENGTH, the base is trimmed from the right.
 */
export function appendSuffix(base: string, suffix: number): string {
  const suffixStr = String(suffix);
  const maxBase = MAX_USERNAME_LENGTH - suffixStr.length;
  const trimmedBase = base.slice(0, maxBase);
  return trimmedBase + suffixStr;
}

/**
 * Strategy for checking whether a given username is already taken.
 * Must check `usernameNormalized` (case-insensitive).
 */
export interface UsernameExistsChecker {
  exists(usernameNormalized: string): Promise<boolean>;
}

/**
 * Strategy for persisting a user record. Must throw an error with
 * `code === 'P2002'` on unique-constraint violations so the generator
 * can retry with a different suffix.
 */
export interface UserCreator<TInput, TResult> {
  create(input: TInput & { username: string; usernameNormalized: string }): Promise<TResult>;
}

/**
 * Generates a unique username from a display name.
 *
 * 1. Slugifies the name.
 * 2. Checks sequential candidates (base, base1, base2, ...) until one is free.
 * 3. Returns both the display username and its normalized form.
 */
export async function generateUsername(
  name: string,
  checker: UsernameExistsChecker,
): Promise<{ username: string; usernameNormalized: string }> {
  const base = slugifyName(name);
  let candidate = base;

  if (!(await checker.exists(candidate))) {
    return { username: candidate, usernameNormalized: candidate };
  }

  for (let suffix = 1; suffix <= 99; suffix++) {
    candidate = appendSuffix(base, suffix);
    if (!(await checker.exists(candidate))) {
      return { username: candidate, usernameNormalized: candidate };
    }
  }

  throw new Error(
    'Could not generate a unique username for "' + name + '" after 100 attempts',
  );
}

/**
 * Creates a user with a generated username, retrying on P2002 conflicts.
 *
 * This handles the race condition where another concurrent request reserves
 * the same username between the `exists` check and the `create` call.
 */
export async function createWithGeneratedUsername<TInput, TResult>(
  name: string,
  checker: UsernameExistsChecker,
  creator: UserCreator<TInput, TResult>,
  input: TInput,
): Promise<TResult> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_CONFLICT_RETRIES; attempt++) {
    const { username, usernameNormalized } = await generateUsername(name, checker);
    try {
      return await creator.create({ ...input, username, usernameNormalized });
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error)) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error(
    'Failed to create user with generated username after ' + MAX_CONFLICT_RETRIES + ' attempts',
  );
}

/**
 * Type guard for Prisma unique constraint violation errors (P2002).
 */
function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === 'P2002'
  );
}