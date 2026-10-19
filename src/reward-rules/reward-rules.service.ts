import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { Prisma } from '@prisma/client';
import { CreateRewardRuleDto } from './dto/create-reward-rule.dto';
import { UpdateRewardRuleDto } from './dto/update-reward-rule.dto';

@Injectable()
export class RewardRulesService {
  constructor(private prisma: PrismaService) {}

  private async getPersonalProfile(userId: string) {
    const profile = await this.prisma.personalProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile) throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  async create(dto: CreateRewardRuleDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);
    return this.prisma.rewardRule.create({
      data: {
        personalId: personal.id,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        targetValue: dto.targetValue,
        period: dto.period,
        conditions: (dto.conditions as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        requiresApproval: dto.requiresApproval ?? true,
        isActive: dto.isActive ?? true,
        giftId: dto.giftId,
      },
      include: { gift: true },
    });
  }

  async findAll(currentUser: CurrentUserPayload) {
    if (currentUser.role === Role.SUPER_ADMIN) {
      return this.prisma.rewardRule.findMany({
        orderBy: { createdAt: 'desc' },
        include: { gift: true, personal: { select: { id: true, name: true } } },
      });
    }
    const personal = await this.getPersonalProfile(currentUser.sub);
    return this.prisma.rewardRule.findMany({
      where: { personalId: personal.id },
      orderBy: { createdAt: 'desc' },
      include: { gift: true },
    });
  }

  async findOne(id: string, currentUser: CurrentUserPayload) {
    const rule = await this.prisma.rewardRule.findUnique({
      where: { id },
      include: { gift: true },
    });
    if (!rule) throw new NotFoundException('Regra de recompensa não encontrada.');
    if (currentUser.role === Role.PERSONAL) {
      const personal = await this.getPersonalProfile(currentUser.sub);
      if (rule.personalId !== personal.id) throw new ForbiddenException();
    }
    return rule;
  }

  async update(id: string, dto: UpdateRewardRuleDto, currentUser: CurrentUserPayload) {
    await this.findOne(id, currentUser);
    return this.prisma.rewardRule.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        targetValue: dto.targetValue,
        period: dto.period,
        conditions: dto.conditions !== undefined ? (dto.conditions as Prisma.InputJsonValue) : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        requiresApproval: dto.requiresApproval,
        isActive: dto.isActive,
        giftId: dto.giftId,
      },
      include: { gift: true },
    });
  }

  async remove(id: string, currentUser: CurrentUserPayload) {
    await this.findOne(id, currentUser);
    await this.prisma.rewardRule.delete({ where: { id } });
  }
}
