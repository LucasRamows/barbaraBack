import { Test } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';

const personalProfile = { id: 'personal-1', userId: 'user-p1', deletedAt: null, name: 'Prof Ana' };
const otherPersonalProfile = { id: 'personal-2', userId: 'user-p2', deletedAt: null, name: 'Prof João' };
const studentProfile = { id: 'student-1', deletedAt: null, user: { id: 'user-s1', username: 'aluno1', status: 'ACTIVE', mustChangePassword: false, createdAt: new Date(), updatedAt: new Date() } };

const prismaMock = {
  personalProfile: { findUnique: jest.fn() },
  personalStudent: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
  studentProfile: { findFirst: jest.fn() },
  user: { create: jest.fn(), update: jest.fn() },
  refreshToken: { updateMany: jest.fn() },
};

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(StudentsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns only students belonging to the requesting personal', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      prismaMock.personalStudent.findMany.mockResolvedValue([
        { student: { ...studentProfile, deletedAt: null } },
      ]);

      const result = await service.findAll({ sub: 'user-p1', role: Role.PERSONAL });

      expect(prismaMock.personalStudent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { personalId: 'personal-1' } }),
      );
      expect(result).toHaveLength(1);
    });

    it('throws ForbiddenException when personal profile not found', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.findAll({ sub: 'user-p1', role: Role.PERSONAL }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('throws ForbiddenException for student belonging to another personal', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(otherPersonalProfile);
      prismaMock.studentProfile.findFirst.mockResolvedValue(studentProfile);
      // No PersonalStudent link between personal-2 and student-1
      prismaMock.personalStudent.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne('student-1', { sub: 'user-p2', role: Role.PERSONAL }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('returns student when personal owns them', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      prismaMock.studentProfile.findFirst.mockResolvedValue(studentProfile);
      prismaMock.personalStudent.findFirst.mockResolvedValue({ personalId: 'personal-1', studentId: 'student-1' });

      const result = await service.findOne('student-1', { sub: 'user-p1', role: Role.PERSONAL });

      expect(result).toEqual(studentProfile);
    });
  });
});
