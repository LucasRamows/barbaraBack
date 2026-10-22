import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { normalizeUsername } from '../identity/identity-audit';
import { createWithGeneratedUsername } from '../identity/username-generator';
import { assertEmailAvailable } from '../identity/identity-email';
import {
  clearProtectedDocumentData,
  documentPreview,
  normalizeAddress,
  normalizeOptionalPhone,
  protectedDocumentData,
} from '../identity/profile-data';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  private async getPersonalProfile(userId: string) {
    const profile = await this.prisma.personalProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile) throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  private async assertOwnership(personalId: string, studentId: string) {
    const link = await this.prisma.personalStudent.findFirst({
      where: { personalId, studentId },
    });
    if (!link) throw new ForbiddenException('Aluno não pertence a este personal.');
  }

  async create(dto: CreateStudentDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);
    const passwordHash = await bcrypt.hash(dto.password, 12);

    let emailData: { email: string; emailNormalized: string } | null = null;
    if (dto.email) {
      emailData = await assertEmailAvailable(this.prisma.user, dto.email);
    }
    const phone = normalizeOptionalPhone(dto.phone);
    const documentData = dto.document
      ? protectedDocumentData(dto.document)
      : undefined;
    if (documentData) {
      const duplicate = await this.prisma.user.findFirst({
        where: { documentHash: documentData.documentHash },
        select: { id: true },
      });
      if (duplicate) throw new ConflictException('CPF/CNPJ já cadastrado.');
    }
    const address = dto.address ? normalizeAddress(dto.address) : undefined;

    const buildCreateData = (username: string, usernameNormalized: string) => ({
      username,
      usernameNormalized,
      email: emailData ? emailData.email : null,
      emailNormalized: emailData ? emailData.emailNormalized : null,
      ...documentData,
      passwordHash,
      role: Role.ALUNO,
      mustChangePassword: true,
      studentProfile: {
        create: {
          name: dto.name,
          email: emailData ? emailData.email : (dto.email || null),
          phone,
          birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
          sex: dto.sex,
          height: dto.height,
          objective: dto.objective,
          experienceLevel: dto.experienceLevel,
          restrictions: dto.restrictions,
          observations: dto.observations,
        },
      },
      ...(address ? { address: { create: address } } : {}),
    });

    let user;
    if (dto.username && dto.username.trim()) {
      const explicitUsername = dto.username.trim();
      const normalized = normalizeUsername(explicitUsername);

      const existing = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username: explicitUsername },
            { usernameNormalized: normalized },
          ],
        },
      });
      if (existing) {
        throw new BadRequestException('Nome de usuário já está em uso.');
      }

      user = await this.prisma.user.create({
        data: buildCreateData(explicitUsername, normalized),
        select: {
          id: true,
          username: true,
          usernameNormalized: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          documentType: true,
          documentLast4: true,
          address: true,
          studentProfile: true,
        },
      });
    } else {
      user = await createWithGeneratedUsername(
        dto.name,
        {
          exists: async (candidate) => {
            const found = await this.prisma.user.findFirst({
              where: {
                OR: [
                  { username: candidate },
                  { usernameNormalized: candidate },
                ],
              },
            });
            return !!found;
          },
        },
        {
          create: async ({ username, usernameNormalized }) => {
            return this.prisma.user.create({
              data: buildCreateData(username, usernameNormalized),
              select: {
                id: true,
                username: true,
                usernameNormalized: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                documentType: true,
                documentLast4: true,
                address: true,
                studentProfile: true,
              },
            });
          },
        },
        {},
      );
    }

    // Link student to personal
    await this.prisma.personalStudent.create({
      data: {
        personalId: personal.id,
        studentId: user.studentProfile!.id,
      },
    });

    const { documentType, documentLast4, ...safeUser } = user;
    return {
      ...safeUser,
      document: documentPreview({ documentType, documentLast4 }),
    };
  }

  async findAll(currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);

    const links = await this.prisma.personalStudent.findMany({
      where: { personalId: personal.id },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return links
      .filter((l) => l.student.deletedAt === null)
      .map((l) => ({
        ...l.student,
        user: l.student.user,
      }));
  }

  async findOne(id: string, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);
    await this.assertOwnership(personal.id, id);

    const student = await this.prisma.studentProfile.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            status: true,
            mustChangePassword: true,
            createdAt: true,
            updatedAt: true,
            documentType: true,
            documentLast4: true,
            address: true,
          },
        },
      },
    });

    if (!student) throw new NotFoundException('Aluno não encontrado.');

    const { documentType, documentLast4, ...safeUser } = student.user;
    return {
      ...student,
      user: {
        ...safeUser,
        document: documentPreview({ documentType, documentLast4 }),
      },
    };
  }

  async update(id: string, dto: UpdateStudentDto, currentUser: CurrentUserPayload) {
    const student = await this.findOne(id, currentUser); // validates existence and ownership

    let emailData: { email: string; emailNormalized: string } | null = null;
    if (dto.email !== undefined) {
      emailData = await assertEmailAvailable(
        this.prisma.user,
        dto.email,
        student.user.id,
      );
    }
    const phone = normalizeOptionalPhone(dto.phone);
    const documentData =
      dto.document === undefined
        ? undefined
        : dto.document === null || dto.document.trim() === ''
          ? clearProtectedDocumentData()
          : protectedDocumentData(dto.document);
    if (documentData?.documentHash) {
      const duplicate = await this.prisma.user.findFirst({
        where: {
          documentHash: documentData.documentHash,
          id: { not: student.user.id },
        },
        select: { id: true },
      });
      if (duplicate) throw new ConflictException('CPF/CNPJ já cadastrado.');
    }
    const address = dto.address ? normalizeAddress(dto.address) : undefined;

    return this.prisma.$transaction(async (tx) => {
      if (
        dto.email !== undefined ||
        documentData !== undefined ||
        dto.address !== undefined
      ) {
        await tx.user.update({
          where: { id: student.user.id },
          data: {
            ...(dto.email !== undefined
              ? {
                  email: emailData ? emailData.email : null,
                  emailNormalized: emailData
                    ? emailData.emailNormalized
                    : null,
                }
              : {}),
            ...(documentData ?? {}),
            ...(dto.address === null
              ? { address: { delete: true } }
              : address
                ? {
                    address: {
                      upsert: { create: address, update: address },
                    },
                  }
                : {}),
          },
        });
      }

      return tx.studentProfile.update({
        where: { id },
        data: {
          name: dto.name,
          email: emailData ? emailData.email : (dto.email === null ? null : undefined),
          phone,
          birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
          sex: dto.sex,
          height: dto.height,
          objective: dto.objective,
          experienceLevel: dto.experienceLevel,
          restrictions: dto.restrictions,
          observations: dto.observations,
        },
      });
    });
  }

  async remove(id: string, currentUser: CurrentUserPayload) {
    const student = await this.findOne(id, currentUser);

    await this.prisma.user.update({
      where: { id: student.user.id },
      data: { deletedAt: new Date(), status: UserStatus.INACTIVE },
    });

    await this.prisma.studentProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updateStatus(id: string, status: UserStatus, currentUser: CurrentUserPayload) {
    const student = await this.findOne(id, currentUser);

    return this.prisma.user.update({
      where: { id: student.user.id },
      data: { status },
      select: { id: true, status: true },
    });
  }

  async resetPassword(id: string, newPassword: string, currentUser: CurrentUserPayload) {
    const student = await this.findOne(id, currentUser);
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: student.user.id },
      data: { passwordHash, mustChangePassword: true },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: student.user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
