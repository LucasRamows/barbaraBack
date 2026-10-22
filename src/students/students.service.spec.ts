import { Test } from '@nestjs/testing';
import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { DocumentType, Role } from '@prisma/client';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';

const personalProfile = { id: 'personal-1', userId: 'user-p1', deletedAt: null, name: 'Prof Ana' };
const otherPersonalProfile = { id: 'personal-2', userId: 'user-p2', deletedAt: null, name: 'Prof João' };
const studentProfile = {
  id: 'student-1',
  deletedAt: null,
  name: 'Maria Silva',
  user: {
    id: 'user-s1',
    username: 'maria.silva',
    usernameNormalized: 'maria.silva',
    email: 'maria@example.com',
    status: 'ACTIVE',
    mustChangePassword: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

describe('StudentsService', () => {
  let service: StudentsService;
  let prismaMock: any;

  beforeAll(() => {
    process.env.DOCUMENT_HASH_PEPPER = 'student-service-test-pepper';
    process.env.DOCUMENT_ENCRYPTION_KEY = 'student-service-test-key';
  });

  beforeEach(async () => {
    prismaMock = {
      personalProfile: { findUnique: jest.fn() },
      personalStudent: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
      studentProfile: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: { updateMany: jest.fn() },
      $transaction: jest.fn((callback) => callback(prismaMock)),
    };

    const module = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(StudentsService);
    jest.clearAllMocks();
    prismaMock.$transaction.mockImplementation((callback: any) => callback(prismaMock));
  });

  describe('create', () => {
    it('creates student with explicit username and stores normalized email', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-1',
        username: 'custom.aluno',
        usernameNormalized: 'custom.aluno',
        email: 'Aluno@Domain.COM',
        emailNormalized: 'aluno@domain.com',
        passwordHash: 'hash',
        role: Role.ALUNO,
        studentProfile: { id: 'sp-1', name: 'Maria Silva' },
      });
      prismaMock.personalStudent.create.mockResolvedValue({ id: 'link-1' });

      const result = await service.create(
        {
          name: 'Maria Silva',
          username: 'custom.aluno',
          email: 'Aluno@Domain.COM',
          password: 'Password123!',
        },
        { sub: 'user-p1', role: Role.PERSONAL },
      );

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            username: 'custom.aluno',
            usernameNormalized: 'custom.aluno',
            email: 'Aluno@Domain.COM',
            emailNormalized: 'aluno@domain.com',
          }),
        }),
      );
      expect(result.username).toBe('custom.aluno');
    });

    it('generates username from name when username is omitted', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-2',
        username: 'joao.d.avila',
        usernameNormalized: 'joao.d.avila',
        passwordHash: 'hash',
        role: Role.ALUNO,
        studentProfile: { id: 'sp-2', name: "João d'Ávila" },
      });
      prismaMock.personalStudent.create.mockResolvedValue({ id: 'link-2' });

      const result = await service.create(
        {
          name: "João d'Ávila",
          password: 'Password123!',
        },
        { sub: 'user-p1', role: Role.PERSONAL },
      );

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            username: 'joao.d.avila',
            usernameNormalized: 'joao.d.avila',
          }),
        }),
      );
      expect(result.username).toBe('joao.d.avila');
    });

    it('throws BadRequestException when explicit username already exists', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      prismaMock.user.findFirst.mockResolvedValue({ id: 'existing-user' });

      await expect(
        service.create(
          {
            name: 'Maria Silva',
            username: 'taken.user',
            password: 'Password123!',
          },
          { sub: 'user-p1', role: Role.PERSONAL },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws ConflictException when email is already taken by another account', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      // First findFirst check for email conflict returns existing user
      prismaMock.user.findFirst.mockResolvedValue({ id: 'other-user' });

      await expect(
        service.create(
          {
            name: 'Maria Silva',
            email: 'taken@example.com',
            password: 'Password123!',
          },
          { sub: 'user-p1', role: Role.PERSONAL },
        ),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    it('stores protected document, canonical phone and normalized address', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-protected',
        username: 'maria.protegida',
        usernameNormalized: 'maria.protegida',
        email: null,
        role: Role.ALUNO,
        status: 'ACTIVE',
        createdAt: new Date(),
        documentType: DocumentType.CPF,
        documentLast4: '4725',
        address: { cep: '41820021' },
        studentProfile: { id: 'student-protected', name: 'Maria Protegida' },
      });
      prismaMock.personalStudent.create.mockResolvedValue({ id: 'link-protected' });

      const result = await service.create(
        {
          name: 'Maria Protegida',
          username: 'maria.protegida',
          password: 'Password123!',
          phone: '(71) 99999-0000',
          document: '529.982.247-25',
          address: {
            cep: '41820-021',
            street: ' Rua das Flores ',
            streetNumber: ' 10 ',
            neighborhood: ' Pituba ',
            city: ' Salvador ',
            uf: 'ba',
          },
        },
        { sub: 'user-p1', role: Role.PERSONAL },
      );

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            documentHash: expect.stringMatching(/^[a-f0-9]{64}$/),
            documentEncrypted: expect.not.stringContaining('52998224725'),
            documentLast4: '4725',
            documentKeyVersion: 1,
            address: {
              create: expect.objectContaining({
                cep: '41820021',
                street: 'Rua das Flores',
                uf: 'BA',
              }),
            },
            studentProfile: {
              create: expect.objectContaining({ phone: '71999990000' }),
            },
          }),
        }),
      );
      expect(result.document).toEqual({
        type: DocumentType.CPF,
        masked: '***.***.47-25',
      });
      expect(result).not.toHaveProperty('documentHash');
      expect(result).not.toHaveProperty('documentEncrypted');
    });

    it('rejects a document already used by any account', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      prismaMock.user.findFirst.mockResolvedValue({ id: 'existing-document-owner' });

      await expect(
        service.create(
          {
            name: 'Outra Maria',
            password: 'Password123!',
            document: '529.982.247-25',
          },
          { sub: 'user-p1', role: Role.PERSONAL },
        ),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates student profile without changing or renaming user username', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      prismaMock.studentProfile.findFirst.mockResolvedValue(studentProfile);
      prismaMock.personalStudent.findFirst.mockResolvedValue({ personalId: 'personal-1', studentId: 'student-1' });
      prismaMock.studentProfile.update.mockResolvedValue({
        ...studentProfile,
        name: 'Maria Silva Atualizada',
      });

      const result = await service.update(
        'student-1',
        { name: 'Maria Silva Atualizada' },
        { sub: 'user-p1', role: Role.PERSONAL },
      );

      expect(prismaMock.studentProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'student-1' },
          data: expect.objectContaining({ name: 'Maria Silva Atualizada' }),
        }),
      );
      expect(prismaMock.user.update).not.toHaveBeenCalled();
      expect(result.name).toBe('Maria Silva Atualizada');
    });

    it('throws ConflictException and prevents mutation when updating to a conflicting email', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      prismaMock.studentProfile.findFirst.mockResolvedValue(studentProfile);
      prismaMock.personalStudent.findFirst.mockResolvedValue({ personalId: 'personal-1', studentId: 'student-1' });
      // Email conflict check finds existing user
      prismaMock.user.findFirst.mockResolvedValue({ id: 'conflicting-user-id' });

      await expect(
        service.update(
          'student-1',
          { email: 'conflict@example.com' },
          { sub: 'user-p1', role: Role.PERSONAL },
        ),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prismaMock.studentProfile.update).not.toHaveBeenCalled();
      expect(prismaMock.user.update).not.toHaveBeenCalled();
    });
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
      const query = prismaMock.personalStudent.findMany.mock.calls[0][0];
      expect(query.include.student.include.user.select).not.toHaveProperty(
        'documentEncrypted',
      );
      expect(query.include.student.include.user.select).not.toHaveProperty(
        'address',
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
      prismaMock.personalStudent.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne('student-1', { sub: 'user-p2', role: Role.PERSONAL }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(prismaMock.studentProfile.findFirst).not.toHaveBeenCalled();
    });

    it('returns student when personal owns them', async () => {
      prismaMock.personalProfile.findUnique.mockResolvedValue(personalProfile);
      prismaMock.studentProfile.findFirst.mockResolvedValue(studentProfile);
      prismaMock.personalStudent.findFirst.mockResolvedValue({ personalId: 'personal-1', studentId: 'student-1' });

      const result = await service.findOne('student-1', { sub: 'user-p1', role: Role.PERSONAL });

      expect(result).toEqual({
        ...studentProfile,
        user: { ...studentProfile.user, document: null },
      });
    });
  });
});
