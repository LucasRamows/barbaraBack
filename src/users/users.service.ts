import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { Role } from '@prisma/client';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(currentUser: CurrentUserPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.sub, deletedAt: null },
      select: {
        id: true,
        username: true,
        role: true,
        status: true,
        mustChangePassword: true,
        createdAt: true,
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
    return user;
  }

  async updateMyProfile(
    currentUser: CurrentUserPayload,
    dto: UpdateMyProfileDto,
  ) {
    if (currentUser.role === Role.ALUNO) {
      return this.prisma.studentProfile.update({
        where: { userId: currentUser.sub },
        data: {
          name: dto.name,
          email: dto.email || null,
          phone: dto.phone || null,
        },
      });
    }

    if (currentUser.role === Role.PERSONAL) {
      return this.prisma.personalProfile.update({
        where: { userId: currentUser.sub },
        data: {
          name: dto.name,
          email: dto.email || null,
          phone: dto.phone || null,
        },
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
      where: { id: user.id },
      data: { passwordHash, mustChangePassword: false },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
