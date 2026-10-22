import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { Prisma, Role } from '@prisma/client';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { assertEmailAvailable } from '../identity/identity-email';
import {
  clearProtectedDocumentData,
  documentPreview,
  normalizeAddress,
  normalizeOptionalPhone,
  protectedDocumentData,
} from '../identity/profile-data';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(currentUser: CurrentUserPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.sub, deletedAt: null },
      select: {
        id: true,
        username: true,
        email: true,
        emailNormalized: true,
        role: true,
        status: true,
        mustChangePassword: true,
        createdAt: true,
        documentType: true,
        documentLast4: true,
        address: true,
        personalProfile: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
            bio: true,
          },
        },
        studentProfile: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
            objective: true,
            experienceLevel: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    // Backward compatibility: ensure profile.email is populated from user.email if empty
    if (user.personalProfile && !user.personalProfile.email && user.email) {
      user.personalProfile.email = user.email;
    }
    if (user.studentProfile && !user.studentProfile.email && user.email) {
      user.studentProfile.email = user.email;
    }

    const { documentType, documentLast4, ...safeUser } = user;
    return {
      ...safeUser,
      document: documentPreview({ documentType, documentLast4 }),
    };
  }

  async updateMyProfile(
    currentUser: CurrentUserPayload,
    dto: UpdateMyProfileDto,
  ) {
    let emailData: { email: string; emailNormalized: string } | null = null;
    if (dto.email !== undefined) {
      emailData = await assertEmailAvailable(
        this.prisma.user,
        dto.email,
        currentUser.sub,
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
          id: { not: currentUser.sub },
        },
        select: { id: true },
      });
      if (duplicate) throw new ConflictException('CPF/CNPJ já cadastrado.');
    }
    const address = dto.address ? normalizeAddress(dto.address) : undefined;

    const updateIdentity = async (tx: Prisma.TransactionClient) => {
      if (
        dto.email === undefined &&
        documentData === undefined &&
        dto.address === undefined
      ) {
        return;
      }
      await tx.user.update({
        where: { id: currentUser.sub },
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
        },
      });
    };

    if (currentUser.role === Role.ALUNO) {
      return this.prisma.$transaction(async (tx) => {
        await updateIdentity(tx);

        return tx.studentProfile.update({
          where: { userId: currentUser.sub },
          data: {
            name: dto.name,
            email: emailData ? emailData.email : (dto.email === null ? null : undefined),
            phone,
          },
        });
      });
    }

    if (currentUser.role === Role.PERSONAL) {
      return this.prisma.$transaction(async (tx) => {
        await updateIdentity(tx);

        return tx.personalProfile.update({
          where: { userId: currentUser.sub },
          data: {
            name: dto.name,
            email: emailData ? emailData.email : (dto.email === null ? null : undefined),
            phone,
          },
        });
      });
    }

    throw new BadRequestException('Este usuário não possui perfil editável.');
  }

  async changePassword(
    currentUser: CurrentUserPayload,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.sub },
      select: { id: true, passwordHash: true },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) throw new BadRequestException('Senha atual incorreta.');

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: currentUser.sub },
      data: { passwordHash, mustChangePassword: false },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: currentUser.sub, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
