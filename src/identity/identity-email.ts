import { ConflictException } from '@nestjs/common';
import { normalizeEmail } from './identity-audit';

export interface EmailUniquenessChecker {
  findFirst(args: {
    where: {
      OR: Array<{ email?: string; emailNormalized?: string }>;
      id?: { not: string };
    };
    select?: { id: true };
  }): Promise<{ id: string } | null>;
}

/**
 * Validates that an email is not in use by any other user account,
 * normalizing it to ensure canonical uniqueness.
 *
 * Throws a ConflictException (409) if the canonical email already exists.
 */
export async function assertEmailAvailable(
  checker: EmailUniquenessChecker,
  email: string | null | undefined,
  excludeUserId?: string,
): Promise<{ email: string; emailNormalized: string } | null> {
  if (!email || !email.trim()) {
    return null;
  }

  const trimmed = email.trim();
  const normalized = normalizeEmail(trimmed);

  const existing = await checker.findFirst({
    where: {
      OR: [
        { email: trimmed },
        { emailNormalized: normalized },
      ],
      ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    throw new ConflictException('E-mail já está em uso por outro usuário.');
  }

  return { email: trimmed, emailNormalized: normalized };
}
