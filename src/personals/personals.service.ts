import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';

@Injectable()
export class PersonalsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePersonalDto) {
    const existing = await this.prisma.user.findFirst({
      where: { username: dto.username },
    });
    if (existing) {
      throw new BadRequestException('Nome de usuário já está em uso.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        role: Role.PERSONAL,
        mustChangePassword: true,
        personalProfile: {
          create: {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
          },
        },
      },
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
    });

    return user;
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
    return user;
  }

  async update(id: string, dto: UpdatePersonalDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        personalProfile: {
          update: {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            bio: dto.bio,
          },
        },
      },
      select: {
        id: true,
        username: true,
        personalProfile: {
          select: { id: true, name: true, email: true, phone: true, bio: true },
        },
      },
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
