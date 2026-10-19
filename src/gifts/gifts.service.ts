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
    if (!profile)
      throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  private async getStudentProfile(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile)
      throw new ForbiddenException('Perfil de aluno não encontrado.');
    return profile;
  }

  private async assertPersonalOwnsStudent(
    personalId: string,
    studentId: string,
  ) {
    const link = await this.prisma.personalStudent.findFirst({
      where: { personalId, studentId },
    });
    if (!link)
      throw new ForbiddenException('Aluno não pertence a este personal.');
  }

  private toResponse<T extends { name: string }>(gift: T) {
    const { name, ...rest } = gift;
    return { ...rest, title: name };
  }

  async create(dto: CreateGiftDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);
    await this.assertPersonalOwnsStudent(personal.id, dto.studentId);
    const gift = await this.prisma.gift.create({
      data: {
        personalId: personal.id,
        studentId: dto.studentId,
        name: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
      },
    });
    return this.toResponse(gift);
  }

  async findAll(studentId: string, currentUser: CurrentUserPayload) {
    if (currentUser.role === Role.ALUNO) {
      const student = await this.getStudentProfile(currentUser.sub);
      if (student.id !== studentId)
        throw new ForbiddenException('Acesso negado.');
    } else if (currentUser.role === Role.PERSONAL) {
      const personal = await this.getPersonalProfile(currentUser.sub);
      await this.assertPersonalOwnsStudent(personal.id, studentId);
    }

    const gifts = await this.prisma.gift.findMany({
      where: { studentId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return gifts.map((gift) => this.toResponse(gift));
  }

  async findOne(id: string, currentUser: CurrentUserPayload) {
    const gift = await this.prisma.gift.findFirst({
      where: { id, deletedAt: null },
    });
    if (!gift) throw new NotFoundException('Gift não encontrado.');
    if (currentUser.role === Role.ALUNO) {
      const student = await this.getStudentProfile(currentUser.sub);
      if (gift.studentId !== student.id)
        throw new ForbiddenException('Acesso negado.');
    } else if (currentUser.role === Role.PERSONAL) {
      const personal = await this.getPersonalProfile(currentUser.sub);
      if (gift.personalId !== personal.id) throw new ForbiddenException();
    }
    return this.toResponse(gift);
  }

  async update(
    id: string,
    dto: UpdateGiftDto,
    currentUser: CurrentUserPayload,
  ) {
    await this.findOne(id, currentUser);
    if (dto.studentId) {
      const personal = await this.getPersonalProfile(currentUser.sub);
      await this.assertPersonalOwnsStudent(personal.id, dto.studentId);
    }
    const gift = await this.prisma.gift.update({
      where: { id },
      data: {
        name: dto.title,
        studentId: dto.studentId,
        description: dto.description,
        imageUrl: dto.imageUrl,
      },
    });
    return this.toResponse(gift);
  }

  async deliver(id: string, currentUser: CurrentUserPayload) {
    await this.findOne(id, currentUser);
    const gift = await this.prisma.gift.update({
      where: { id },
      data: { isDelivered: true, deliveredAt: new Date() },
    });
    return this.toResponse(gift);
  }

  async remove(id: string, currentUser: CurrentUserPayload) {
    await this.findOne(id, currentUser);
    await this.prisma.gift.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
