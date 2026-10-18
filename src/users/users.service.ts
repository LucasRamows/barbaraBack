import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';

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
}
