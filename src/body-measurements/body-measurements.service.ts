import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateBodyMeasurementDto } from './dto/create-body-measurement.dto';
import { UpdateBodyMeasurementDto } from './dto/update-body-measurement.dto';
import { isValidCivilDate } from '../identity/civil-date.validator';
import { RewardAchievementsService } from '../reward-achievements/reward-achievements.service';

@Injectable()
export class BodyMeasurementsService {
  constructor(
    private prisma: PrismaService,
    private rewardAchievements: RewardAchievementsService,
  ) {}

  private toResponse<
    T extends {
      measuredAt: Date;
      bodyFatPercent: number | null;
      rightArm: number | null;
      rightThigh: number | null;
      shoulders: number | null;
      abdomen: number | null;
      leftArm: number | null;
      rightForearm: number | null;
      leftForearm: number | null;
      rightCalf: number | null;
      leftCalf: number | null;
      face: number | null;
      hairLength: number | null;
    },
  >(measurement: T) {
    const {
      measuredAt,
      bodyFatPercent,
      rightArm,
      rightThigh,
      ...rest
    } =
      measurement;
    return {
      ...rest,
      date: measuredAt,
      bodyFat: bodyFatPercent,
      arm: rightArm,
      thigh: rightThigh,
    };
  }

  private async assertAccess(
    userId: string,
    role: Role,
    studentId: string,
  ): Promise<void> {
    if (role === Role.ALUNO) {
      const profile = await this.prisma.studentProfile.findUnique({
        where: { userId },
      });
      if (!profile || profile.id !== studentId) {
        throw new ForbiddenException('Acesso negado.');
      }
      return;
    }

    if (role === Role.PERSONAL) {
      const personal = await this.prisma.personalProfile.findUnique({
        where: { userId, deletedAt: null },
      });
      if (!personal)
        throw new ForbiddenException('Perfil de personal não encontrado.');
      const link = await this.prisma.personalStudent.findFirst({
        where: { personalId: personal.id, studentId },
      });
      if (!link)
        throw new ForbiddenException('Aluno não pertence a este personal.');
      return;
    }

    if (role === Role.SUPER_ADMIN) {
      const personal = await this.prisma.personalProfile.findUnique({
        where: { userId, deletedAt: null },
      });
      if (!personal) {
        throw new ForbiddenException(
          'Super Admin sem vínculo com este aluno não pode acessar dados sensíveis.',
        );
      }
      const link = await this.prisma.personalStudent.findFirst({
        where: { personalId: personal.id, studentId },
      });
      if (!link) {
        throw new ForbiddenException(
          'Super Admin sem vínculo com este aluno não pode acessar dados sensíveis.',
        );
      }
    }
  }

  async create(dto: CreateBodyMeasurementDto, currentUser: CurrentUserPayload) {
    await this.assertAccess(currentUser.sub, currentUser.role, dto.studentId);

    const measurement = await this.prisma.bodyMeasurement.create({
      data: {
        studentId: dto.studentId,
        measuredAt: dto.date ? new Date(dto.date) : new Date(),
        measuredById: currentUser.sub,
        weight: dto.weight,
        height: dto.height,
        bodyFatPercent: dto.bodyFat,
        shoulders: dto.shoulders,
        chest: dto.chest,
        waist: dto.waist,
        abdomen: dto.abdomen,
        hips: dto.hips,
        rightArm: dto.rightArm ?? dto.arm,
        leftArm: dto.leftArm,
        rightForearm: dto.rightForearm,
        leftForearm: dto.leftForearm,
        rightThigh: dto.rightThigh ?? dto.thigh,
        leftThigh: dto.leftThigh,
        rightCalf: dto.rightCalf,
        leftCalf: dto.leftCalf,
        neck: dto.neck,
        face: dto.face,
        hairLength: dto.hairLength,
        notes: dto.notes,
      },
    });
    await this.rewardAchievements.enqueueEvaluation(
      dto.studentId,
      'BODY_MEASUREMENT_CHANGED',
      measurement.id,
    );
    return this.toResponse(measurement);
  }

  async findAll(studentId: string, currentUser: CurrentUserPayload) {
    await this.assertAccess(currentUser.sub, currentUser.role, studentId);

    const measurements = await this.prisma.bodyMeasurement.findMany({
      where: { studentId },
      orderBy: { measuredAt: 'asc' },
    });
    return measurements.map((measurement) => this.toResponse(measurement));
  }

  async getProgress(
    studentId: string,
    from: string | undefined,
    to: string | undefined,
    currentUser: CurrentUserPayload,
  ) {
    await this.assertAccess(currentUser.sub, currentUser.role, studentId);
    if (from && !isValidCivilDate(from)) throw new ForbiddenException('Data inicial inválida.');
    if (to && !isValidCivilDate(to)) throw new ForbiddenException('Data final inválida.');
    if (from && to && from > to) throw new ForbiddenException('Intervalo de datas inválido.');

    const start = from ? new Date(`${from}T00:00:00.000Z`) : undefined;
    const end = to ? new Date(`${to}T23:59:59.999Z`) : undefined;
    const measurements = await this.prisma.bodyMeasurement.findMany({
      where: { studentId, measuredAt: { ...(start ? { gte: start } : {}), ...(end ? { lte: end } : {}) } },
      orderBy: [{ measuredAt: 'asc' }, { createdAt: 'asc' }],
    });
    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        studentId,
        status: { in: ['COMPLETED', 'PARTIAL'] },
        startedAt: { ...(start ? { gte: start } : {}), ...(end ? { lte: end } : {}) },
      },
      select: { status: true },
    });
    return {
      studentId,
      from: from ?? null,
      to: to ?? null,
      measurements: measurements.map((measurement) => this.toResponse(measurement)),
      workoutCadence: {
        total: sessions.length,
        completed: sessions.filter((session) => session.status === 'COMPLETED').length,
        partial: sessions.filter((session) => session.status === 'PARTIAL').length,
      },
    };
  }

  async findOne(id: string, currentUser: CurrentUserPayload) {
    const measurement = await this.prisma.bodyMeasurement.findUnique({
      where: { id },
    });
    if (!measurement) throw new NotFoundException('Medida não encontrada.');

    await this.assertAccess(
      currentUser.sub,
      currentUser.role,
      measurement.studentId,
    );
    return this.toResponse(measurement);
  }

  async update(
    id: string,
    dto: UpdateBodyMeasurementDto,
    currentUser: CurrentUserPayload,
  ) {
    await this.findOne(id, currentUser);

    const measurement = await this.prisma.bodyMeasurement.update({
      where: { id },
      data: {
        measuredAt: dto.date ? new Date(dto.date) : undefined,
        weight: dto.weight,
        height: dto.height,
        bodyFatPercent: dto.bodyFat,
        shoulders: dto.shoulders,
        chest: dto.chest,
        waist: dto.waist,
        abdomen: dto.abdomen,
        hips: dto.hips,
        rightArm: dto.rightArm,
        leftArm: dto.leftArm,
        rightForearm: dto.rightForearm,
        leftForearm: dto.leftForearm,
        rightThigh: dto.rightThigh,
        leftThigh: dto.leftThigh,
        rightCalf: dto.rightCalf,
        leftCalf: dto.leftCalf,
        neck: dto.neck,
        face: dto.face,
        hairLength: dto.hairLength,
        notes: dto.notes,
      },
    });
    await this.rewardAchievements.enqueueEvaluation(
      measurement.studentId,
      'BODY_MEASUREMENT_CHANGED',
      measurement.id,
    );
    return this.toResponse(measurement);
  }

  async remove(id: string, currentUser: CurrentUserPayload) {
    await this.findOne(id, currentUser);
    await this.prisma.bodyMeasurement.delete({ where: { id } });
  }
}
