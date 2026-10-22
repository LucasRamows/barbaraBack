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
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
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
export class PersonalsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePersonalDto) {
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

    const selectFields = {
      id: true,
      username: true,
      usernameNormalized: true,
      email: true,
      emailNormalized: true,
      documentType: true,
      documentLast4: true,
      role: true,
      status: true,
      createdAt: true,
      address: true,
      personalProfile: {
        select: { id: true, name: true, email: true, phone: true },
      },
    };

    const buildCreateData = (username: string, usernameNormalized: string) => ({
      username,
      usernameNormalized,
      email: emailData ? emailData.email : null,
      emailNormalized: emailData ? emailData.emailNormalized : null,
      ...documentData,
      passwordHash,
      role: Role.PERSONAL,
      mustChangePassword: true,
      personalProfile: {
        create: {
          name: dto.name,
          email: emailData ? emailData.email : (dto.email || null),
          phone,
        },
      },
      ...(address ? { address: { create: address } } : {}),
    });

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

      const user = await this.prisma.user.create({
        data: buildCreateData(explicitUsername, normalized),
        select: selectFields,
      });
      const { documentType, documentLast4, ...safeUser } = user;
      return {
        ...safeUser,
        document: documentPreview({ documentType, documentLast4 }),
      };
    }

    const user = await createWithGeneratedUsername(
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
            select: selectFields,
          });
        },
      },
      {},
    );
    const { documentType, documentLast4, ...safeUser } = user;
    return {
      ...safeUser,
      document: documentPreview({ documentType, documentLast4 }),
    };
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { role: Role.PERSONAL, deletedAt: null },
      select: {
        id: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
        personalProfile: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, role: Role.PERSONAL, deletedAt: null },
      select: {
        id: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        documentType: true,
        documentLast4: true,
        address: true,
        personalProfile: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bio: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Personal não encontrado.');
    const { documentType, documentLast4, ...safeUser } = user;
    return {
      ...safeUser,
      document: documentPreview({ documentType, documentLast4 }),
    };
  }

  async update(id: string, dto: UpdatePersonalDto) {
    await this.findOne(id);

    let emailData: { email: string; emailNormalized: string } | null = null;
    if (dto.email !== undefined) {
      emailData = await assertEmailAvailable(this.prisma.user, dto.email, id);
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
        where: { documentHash: documentData.documentHash, id: { not: id } },
        select: { id: true },
      });
      if (duplicate) throw new ConflictException('CPF/CNPJ já cadastrado.');
    }
    const address = dto.address ? normalizeAddress(dto.address) : undefined;

    return this.prisma.$transaction(async (tx) => {
      return tx.user.update({
        where: { id },
        data: {
          ...(dto.email !== undefined
            ? {
                email: emailData ? emailData.email : null,
                emailNormalized: emailData ? emailData.emailNormalized : null,
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
          personalProfile: {
            update: {
              name: dto.name,
              email: emailData ? emailData.email : (dto.email === null ? null : undefined),
              phone,
              bio: dto.bio,
            },
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
          emailNormalized: true,
          documentType: true,
          documentLast4: true,
          address: true,
          personalProfile: {
            select: { id: true, name: true, email: true, phone: true, bio: true },
          },
        },
      }).then((user) => {
        const { documentType, documentLast4, ...safeUser } = user;
        return {
          ...safeUser,
          document: documentPreview({ documentType, documentLast4 }),
        };
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: UserStatus.INACTIVE },
    });
  }

  async updateStatus(id: string, status: UserStatus) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    });
  }

  async resetPassword(id: string, newPassword: string) {
    await this.findOne(id);

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash, mustChangePassword: true },
    });

    // Revoke all refresh tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
