import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateDeloadDto } from './dto/create-deload.dto';
import { UpdateDeloadDto } from './dto/update-deload.dto';

@Injectable()
export class DeloadsService {
  constructor(private prisma: PrismaService) {}

  private async getPersonalProfile(userId: string) {
    const profile = await this.prisma.personalProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile) throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  private async assertPersonalOwnsStudent(personalId: string, studentId: string) {
    const link = await this.prisma.personalStudent.findFirst({
      where: { personalId, studentId },
    });
    if (!link) throw new ForbiddenException('Aluno não pertence a este personal.');
  }

  async create(dto: CreateDeloadDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);
    await this.assertPersonalOwnsStudent(personal.id, dto.studentId);

    return this.prisma.deloadPeriod.create({
      data: {
        studentId: dto.studentId,
        personalId: personal.id,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reductionPercent: dto.reductionPercent,
        reason: dto.reason,
        observations: dto.observations,
      },
    });
  }

  async findAll(currentUser: CurrentUserPayload, studentId?: string) {
    let targetStudentId: string;

    if (currentUser.role === Role.ALUNO) {
      const student = await this.prisma.studentProfile.findUnique({
        where: { userId: currentUser.sub },
      });
      if (!student) throw new ForbiddenException('Perfil de aluno não encontrado.');
      targetStudentId = student.id;
    } else {
      if (!studentId) throw new ForbiddenException('studentId obrigatório para personal.');
      const personal = await this.getPersonalProfile(currentUser.sub);
      await this.assertPersonalOwnsStudent(personal.id, studentId);
      targetStudentId = studentId;
    }

    return this.prisma.deloadPeriod.findMany({
      where: { studentId: targetStudentId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findActive(studentId: string) {
    const now = new Date();
    return this.prisma.deloadPeriod.findFirst({
      where: {
        studentId,
        status: 'ACTIVE',
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });
  }

  async update(id: string, dto: UpdateDeloadDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);

    const deload = await this.prisma.deloadPeriod.findUnique({ where: { id } });
    if (!deload) throw new NotFoundException('Período de deload não encontrado.');
    if (deload.personalId !== personal.id) throw new ForbiddenException('Acesso negado.');

    return this.prisma.deloadPeriod.update({
      where: { id },
      data: {
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        reductionPercent: dto.reductionPercent,
        reason: dto.reason,
        observations: dto.observations,
        status: dto.status,
      },
    });
  }

  async remove(id: string, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);

    const deload = await this.prisma.deloadPeriod.findUnique({ where: { id } });
    if (!deload) throw new NotFoundException('Período de deload não encontrado.');
    if (deload.personalId !== personal.id) throw new ForbiddenException('Acesso negado.');

    await this.prisma.deloadPeriod.delete({ where: { id } });
  }
}
