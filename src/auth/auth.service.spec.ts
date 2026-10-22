import { Test } from '@nestjs/testing';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role, UserStatus } from '@prisma/client';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

const mockUser = {
  id: 'user-1',
  username: 'aluno1',
  usernameNormalized: 'aluno1',
  email: 'aluno@example.com',
  emailNormalized: 'aluno@example.com',
  passwordHash: bcrypt.hashSync('senha123', 10),
  role: Role.ALUNO,
  status: UserStatus.ACTIVE,
  mustChangePassword: false,
  deletedAt: null,
  personalProfile: null,
  studentProfile: { name: 'Aluno Um' },
};

const mockRefreshRecord = {
  id: 'rt-1',
  token: 'valid-refresh-token',
  userId: 'user-1',
  expiresAt: new Date(Date.now() + 86400000),
  revokedAt: null,
  user: { ...mockUser, studentProfile: undefined, personalProfile: undefined },
};

const prismaMock = {
  user: {
    findFirst: jest.fn(),
  },
  refreshToken: {
    create: jest.fn().mockResolvedValue({}),
    findUnique: jest.fn(),
    update: jest.fn().mockResolvedValue({}),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('authenticates with legacy username field', async () => {
      prismaMock.user.findFirst.mockResolvedValue(mockUser);
      prismaMock.refreshToken.create.mockResolvedValue({ token: 'rt' });

      const result = await service.login({ username: 'aluno1', password: 'senha123' });

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { username: 'aluno1' },
              { usernameNormalized: 'aluno1' },
            ]),
          }),
        }),
      );
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.username).toBe('aluno1');
    });

    it('authenticates with identifier field using username', async () => {
      prismaMock.user.findFirst.mockResolvedValue(mockUser);
      prismaMock.refreshToken.create.mockResolvedValue({ token: 'rt' });

      const result = await service.login({ identifier: 'aluno1', password: 'senha123' });

      expect(result.accessToken).toBeDefined();
      expect(result.user.username).toBe('aluno1');
    });

    it('authenticates with identifier field using email (case-insensitive)', async () => {
      prismaMock.user.findFirst.mockResolvedValue(mockUser);
      prismaMock.refreshToken.create.mockResolvedValue({ token: 'rt' });

      const result = await service.login({ identifier: '  Aluno@Example.COM ', password: 'senha123' });

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { emailNormalized: 'aluno@example.com' },
            ]),
          }),
        }),
      );
      expect(result.accessToken).toBeDefined();
      expect(result.user.username).toBe('aluno1');
    });

    it('authenticates with legacy username field holding an email', async () => {
      prismaMock.user.findFirst.mockResolvedValue(mockUser);
      prismaMock.refreshToken.create.mockResolvedValue({ token: 'rt' });

      const result = await service.login({ username: 'Aluno@Example.COM', password: 'senha123' });

      expect(result.accessToken).toBeDefined();
      expect(result.user.username).toBe('aluno1');
    });

    it('preserves generic error message to prevent user enumeration on wrong password', async () => {
      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      await expect(service.login({ identifier: 'aluno1', password: 'wrong' })).rejects.toThrow(
        'Usuário ou senha inválidos.',
      );
    });

    it('preserves generic error message to prevent user enumeration on non-existent user', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      await expect(service.login({ identifier: 'unknown@user.com', password: 'any' })).rejects.toThrow(
        'Usuário ou senha inválidos.',
      );
    });

    it('throws ForbiddenException for inactive user', async () => {
      prismaMock.user.findFirst.mockResolvedValue({ ...mockUser, status: UserStatus.INACTIVE });

      await expect(service.login({ identifier: 'aluno1', password: 'senha123' })).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('throws ForbiddenException for blocked user', async () => {
      prismaMock.user.findFirst.mockResolvedValue({ ...mockUser, status: UserStatus.BLOCKED });

      await expect(service.login({ identifier: 'aluno1', password: 'senha123' })).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });

  describe('refresh', () => {
    it('returns new tokens for valid refresh token', async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue(mockRefreshRecord);
      prismaMock.refreshToken.create.mockResolvedValue({ token: 'new-rt' });

      const result = await service.refresh('valid-refresh-token');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(prismaMock.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { revokedAt: expect.any(Date) } }),
      );
    });

    it('throws UnauthorizedException for revoked token', async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue({
        ...mockRefreshRecord,
        revokedAt: new Date(),
      });

      await expect(service.refresh('revoked-token')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws UnauthorizedException for expired token', async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue({
        ...mockRefreshRecord,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.refresh('expired-token')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws UnauthorizedException for unknown token', async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue(null);

      await expect(service.refresh('unknown')).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('revokes the refresh token', async () => {
      await service.logout('some-token');

      expect(prismaMock.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { token: 'some-token', revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });
});
