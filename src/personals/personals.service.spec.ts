import { Test } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PersonalsService } from './personals.service';
import { PrismaService } from '../prisma/prisma.service';

const personalUser = {
  id: 'user-p1',
  username: 'carlos.silva',
  usernameNormalized: 'carlos.silva',
  role: Role.PERSONAL,
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date(),
  personalProfile: {
    id: 'prof-1',
    name: 'Carlos Silva',
    email: 'carlos@personal.com',
    phone: '11999990000',
    bio: null,
    avatarUrl: null,
  },
};

describe('PersonalsService', () => {
  let service: PersonalsService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: { updateMany: jest.fn() },
      $transaction: jest.fn((callback) => callback(prismaMock)),
    };

    const module = await Test.createTestingModule({
      providers: [
        PersonalsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(PersonalsService);
    jest.clearAllMocks();
    prismaMock.$transaction.mockImplementation((callback: any) => callback(prismaMock));
  });

  describe('create', () => {
    it('creates personal with explicit username and normalized email', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-p1',
        username: 'prof.carlos',
        usernameNormalized: 'prof.carlos',
        email: 'Carlos@Academia.COM',
        emailNormalized: 'carlos@academia.com',
        role: Role.PERSONAL,
        status: 'ACTIVE',
        createdAt: new Date(),
        personalProfile: { id: 'pp-1', name: 'Carlos Silva', email: 'Carlos@Academia.COM', phone: null },
      });

      const result = await service.create({
        name: 'Carlos Silva',
        username: 'prof.carlos',
        email: 'Carlos@Academia.COM',
        password: 'Password123!',
      });

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            username: 'prof.carlos',
            usernameNormalized: 'prof.carlos',
            email: 'Carlos@Academia.COM',
            emailNormalized: 'carlos@academia.com',
          }),
        }),
      );
      expect(result.username).toBe('prof.carlos');
    });

    it('generates username from name when username is omitted', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-p2',
        username: 'joao.da.costa',
        usernameNormalized: 'joao.da.costa',
        role: Role.PERSONAL,
        status: 'ACTIVE',
        createdAt: new Date(),
        personalProfile: { id: 'pp-2', name: 'João da Costa', email: null, phone: null },
      });

      const result = await service.create({
        name: 'João da Costa',
        password: 'Password123!',
      });

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            username: 'joao.da.costa',
            usernameNormalized: 'joao.da.costa',
          }),
        }),
      );
      expect(result.username).toBe('joao.da.costa');
    });

    it('throws BadRequestException when explicit username is taken', async () => {
      prismaMock.user.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create({
          name: 'Carlos Silva',
          username: 'taken.personal',
          password: 'Password123!',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws ConflictException when email is taken', async () => {
      prismaMock.user.findFirst.mockResolvedValue({ id: 'taken-user' });

      await expect(
        service.create({
          name: 'Carlos Silva',
          email: 'taken@example.com',
          password: 'Password123!',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates personal profile name without changing user username', async () => {
      prismaMock.user.findFirst.mockResolvedValue(personalUser);
      prismaMock.user.update.mockResolvedValue({
        id: personalUser.id,
        username: personalUser.username,
        personalProfile: { ...personalUser.personalProfile, name: 'Carlos Silva Senior' },
      });

      const result = await service.update(personalUser.id, {
        name: 'Carlos Silva Senior',
      });

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: personalUser.id },
          data: expect.objectContaining({
            personalProfile: {
              update: expect.objectContaining({ name: 'Carlos Silva Senior' }),
            },
          }),
        }),
      );
      expect(result.username).toBe(personalUser.username);
    });

    it('throws ConflictException and prevents mutation when updating to conflicting email', async () => {
      prismaMock.user.findFirst
        .mockResolvedValueOnce(personalUser) // findOne
        .mockResolvedValueOnce({ id: 'other-user' }); // email check

      await expect(
        service.update(personalUser.id, {
          email: 'conflict@example.com',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prismaMock.user.update).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns personal user when found', async () => {
      prismaMock.user.findFirst.mockResolvedValue(personalUser);

      const result = await service.findOne('user-p1');
      expect(result).toEqual({ ...personalUser, document: null });
    });

    it('throws NotFoundException when personal does not exist', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
