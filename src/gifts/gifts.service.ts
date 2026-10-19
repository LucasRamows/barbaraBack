import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

@Injectable()
export class GiftsService {
  constructor(private prisma: PrismaService) {}

  private async getPersonalProfile(userId: string) {
    const profile = await this.prisma.personalProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile) throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  async create(dto: CreateGiftDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);
    return this.prisma.gift.create({
      data: {
        personalId: personal.id,
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        instructions: dto.instructions,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll(currentUser: CurrentUserPayload) {
    if (currentUser.role === Role.SUPER_ADMIN) {
      return this.prisma.gift.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: { personal: { select: { id: true, name: true } } },
      });
    }
    const personal = await this.getPersonalProfile(currentUser.sub);
    return this.prisma.gift.findMany({
      where: { personalId: personal.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, currentUser: CurrentUserPayload) {
    const gift = await this.prisma.gift.findFirst({
      where: { id, deletedAt: null },
    });
    if (!gift) throw new NotFoundException('Gift não encontrado.');
    if (currentUser.role === Role.PERSONAL) {
      const personal = await this.getPersonalProfile(currentUser.sub);
      if (gift.personalId !== personal.id) throw new ForbiddenException();
    }
    return gift;
  }

  async update(id: string, dto: UpdateGiftDto, currentUser: CurrentUserPayload) {
    await this.findOne(id, currentUser);
    return this.prisma.gift.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        instructions: dto.instructions,
        isActive: dto.isActive,
      },
    });
  }

  async remove(id: string, currentUser: CurrentUserPayload) {
    await this.findOne(id, currentUser);
    await this.prisma.gift.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
