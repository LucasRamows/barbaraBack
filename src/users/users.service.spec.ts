import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

const baseUser = {
  id: 'user-1',
  username: 'aluno.silva',
  email: 'silva@example.com',
  emailNormalized: 'silva@example.com',
  role: Role.ALUNO,
  status: 'ACTIVE',
  mustChangePassword: false,
  createdAt: new Date(),
  studentProfile: {
    id: 'sp-1',
    name: 'Silva Aluno',
    email: 'silva@example.com',
    phone: '11999990000',
    avatarUrl: null,
    objective: 'Condicionamento',
    experienceLevel: 'BEGINNER',
  },
  personalProfile: null,
};

describe('UsersService', () => {
  let service: UsersService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    studentProfile: {
      update: jest.fn(),
    },
    personalProfile: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(UsersService);
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('returns user with email and fills profile email if absent', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...baseUser,
        studentProfile: { ...baseUser.studentProfile, email: null },
      });

      const result = await service.getMe({ sub: 'user-1', role: Role.ALUNO });

      expect(result.email).toBe('silva@example.com');
      expect(result.studentProfile?.email).toBe('silva@example.com');
    });

    it('throws NotFoundException if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe({ sub: 'missing', role: Role.ALUNO })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('updateMyProfile', () => {
    it('updates email and name in transaction for student', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        const tx = {
          user: { update: jest.fn().mockResolvedValue({}) },
          studentProfile: {
            update: jest.fn().mockResolvedValue({
              id: 'sp-1',
              name: 'Novo Nome',
              email: 'novo@example.com',
            }),
          },
        };
        return callback(tx);
      });

      const result = await service.updateMyProfile(
        { sub: 'user-1', role: Role.ALUNO },
        { name: 'Novo Nome', email: 'Novo@Example.COM' },
      );

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { not: 'user-1' },
          }),
        }),
      );
      expect(result.name).toBe('Novo Nome');
    });

    it('throws ConflictException and performs no mutation if email is already taken by another role', async () => {
      prismaMock.user.findFirst.mockResolvedValue({ id: 'personal-user-99' });

      await expect(
        service.updateMyProfile(
          { sub: 'user-1', role: Role.ALUNO },
          { name: 'Novo Nome', email: 'taken@example.com' },
        ),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prismaMock.$transaction).not.toHaveBeenCalled();
      expect(prismaMock.user.update).not.toHaveBeenCalled();
      expect(prismaMock.studentProfile.update).not.toHaveBeenCalled();
    });
  });
});
