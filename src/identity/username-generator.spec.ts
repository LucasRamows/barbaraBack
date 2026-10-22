import {
  slugifyName,
  appendSuffix,
  generateUsername,
  createWithGeneratedUsername,
  type UsernameExistsChecker,
  type UserCreator,
} from './username-generator';

describe('slugifyName', () => {
  it('normalizes accented characters', () => {
    expect(slugifyName("João d'Ávila")).toBe('joao.d.avila');
  });

  it('handles names with mixed case', () => {
    expect(slugifyName('Maria DA SILVA')).toBe('maria.da.silva');
  });

  it('handles empty string', () => {
    expect(slugifyName('')).toBe('user');
  });

  it('handles whitespace-only input', () => {
    expect(slugifyName('   ')).toBe('user');
  });

  it('handles special characters only', () => {
    expect(slugifyName('---@@@###')).toBe('user');
  });

  it('truncates long names to the limit', () => {
    const longName = 'A'.repeat(50);
    const result = slugifyName(longName);
    expect(result.length).toBeLessThanOrEqual(30);
  });

  it('replaces multiple separators with a single dot', () => {
    expect(slugifyName('Maria   --  Silva')).toBe('maria.silva');
  });

  it('strips leading and trailing dots', () => {
    expect(slugifyName(' .Maria. ')).toBe('maria');
  });

  it('preserves numbers in names', () => {
    expect(slugifyName('Aluno 42')).toBe('aluno.42');
  });
});

describe('appendSuffix', () => {
  it('appends a numeric suffix', () => {
    expect(appendSuffix('maria.silva', 1)).toBe('maria.silva1');
  });

  it('trims base when suffix would exceed the limit', () => {
    const base = 'a'.repeat(30);
    const result = appendSuffix(base, 99);
    expect(result.length).toBeLessThanOrEqual(30);
    expect(result).toMatch(/99$/);
  });
});

describe('generateUsername', () => {
  it('returns the base slug when no conflict exists', async () => {
    const checker: UsernameExistsChecker = { exists: jest.fn().mockResolvedValue(false) };

    const result = await generateUsername('Maria da Silva', checker);

    expect(result).toEqual({
      username: 'maria.da.silva',
      usernameNormalized: 'maria.da.silva',
    });
    expect(checker.exists).toHaveBeenCalledTimes(1);
  });

  it('appends sequential suffixes on collision', async () => {
    const taken = new Set(['maria.silva', 'maria.silva1', 'maria.silva2']);
    const checker: UsernameExistsChecker = {
      exists: jest.fn().mockImplementation(async (name: string) => taken.has(name)),
    };

    const result = await generateUsername('Maria Silva', checker);

    expect(result).toEqual({
      username: 'maria.silva3',
      usernameNormalized: 'maria.silva3',
    });
  });

  it('throws after exhausting 100 attempts', async () => {
    const checker: UsernameExistsChecker = { exists: jest.fn().mockResolvedValue(true) };

    await expect(generateUsername('Maria', checker)).rejects.toThrow(
      /after 100 attempts/,
    );
  });
});

describe('createWithGeneratedUsername', () => {
  it('creates successfully on the first attempt', async () => {
    const checker: UsernameExistsChecker = { exists: jest.fn().mockResolvedValue(false) };
    const created = { id: '1', username: 'maria.silva' };
    const creator: UserCreator<{ role: string }, typeof created> = {
      create: jest.fn().mockResolvedValue(created),
    };

    const result = await createWithGeneratedUsername(
      'Maria Silva',
      checker,
      creator,
      { role: 'ALUNO' },
    );

    expect(result).toEqual(created);
    expect(creator.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'maria.silva',
        usernameNormalized: 'maria.silva',
        role: 'ALUNO',
      }),
    );
  });

  it('retries on P2002 unique constraint error (concurrent creation)', async () => {
    let callCount = 0;
    const checker: UsernameExistsChecker = {
      exists: jest.fn().mockResolvedValue(false),
    };
    const p2002Error = Object.assign(new Error('Unique constraint'), { code: 'P2002' });
    const created = { id: '2', username: 'maria.silva' };

    const creator: UserCreator<{ role: string }, typeof created> = {
      create: jest.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) throw p2002Error;
        return created;
      }),
    };

    const result = await createWithGeneratedUsername(
      'Maria Silva',
      checker,
      creator,
      { role: 'ALUNO' },
    );

    expect(result).toEqual(created);
    expect(creator.create).toHaveBeenCalledTimes(2);
  });

  it('rethrows non-P2002 errors immediately', async () => {
    const checker: UsernameExistsChecker = { exists: jest.fn().mockResolvedValue(false) };
    const otherError = new Error('Database connection lost');
    const creator: UserCreator<{ role: string }, never> = {
      create: jest.fn().mockRejectedValue(otherError),
    };

    await expect(
      createWithGeneratedUsername('Maria', checker, creator, { role: 'ALUNO' }),
    ).rejects.toThrow('Database connection lost');
    expect(creator.create).toHaveBeenCalledTimes(1);
  });

  it('gives up after maximum retries on repeated P2002', async () => {
    const checker: UsernameExistsChecker = { exists: jest.fn().mockResolvedValue(false) };
    const p2002Error = Object.assign(new Error('Unique constraint'), { code: 'P2002' });
    const creator: UserCreator<{ role: string }, never> = {
      create: jest.fn().mockRejectedValue(p2002Error),
    };

    await expect(
      createWithGeneratedUsername('Maria', checker, creator, { role: 'ALUNO' }),
    ).rejects.toThrow('Unique constraint');
    expect(creator.create).toHaveBeenCalledTimes(5);
  });
});