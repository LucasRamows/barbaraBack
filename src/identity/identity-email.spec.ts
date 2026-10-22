import { ConflictException } from '@nestjs/common';
import { assertEmailAvailable, type EmailUniquenessChecker } from './identity-email';

describe('assertEmailAvailable', () => {
  it('returns null for null, undefined, or empty email', async () => {
    const checker: EmailUniquenessChecker = { findFirst: jest.fn() };

    expect(await assertEmailAvailable(checker, null)).toBeNull();
    expect(await assertEmailAvailable(checker, undefined)).toBeNull();
    expect(await assertEmailAvailable(checker, '   ')).toBeNull();
    expect(checker.findFirst).not.toHaveBeenCalled();
  });

  it('normalizes email to lowercase and trimmed format', async () => {
    const checker: EmailUniquenessChecker = { findFirst: jest.fn().mockResolvedValue(null) };

    const result = await assertEmailAvailable(checker, '  User@Domain.COM  ');

    expect(result).toEqual({
      email: 'User@Domain.COM',
      emailNormalized: 'user@domain.com',
    });
    expect(checker.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          { email: 'User@Domain.COM' },
          { emailNormalized: 'user@domain.com' },
        ],
      },
      select: { id: true },
    });
  });

  it('throws ConflictException when email is already taken', async () => {
    const checker: EmailUniquenessChecker = {
      findFirst: jest.fn().mockResolvedValue({ id: 'existing-user' }),
    };

    await expect(assertEmailAvailable(checker, 'taken@example.com')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('excludes target user id when updating an existing account', async () => {
    const checker: EmailUniquenessChecker = { findFirst: jest.fn().mockResolvedValue(null) };

    const result = await assertEmailAvailable(checker, 'mine@example.com', 'user-123');

    expect(result).toEqual({
      email: 'mine@example.com',
      emailNormalized: 'mine@example.com',
    });
    expect(checker.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [
          { email: 'mine@example.com' },
          { emailNormalized: 'mine@example.com' },
        ],
        id: { not: 'user-123' },
      },
      select: { id: true },
    });
  });
});
