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

@Injectable()
export class BodyMeasurementsService {
  constructor(private prisma: PrismaService) {}

  private toResponse<
    T extends {
      measuredAt: Date;
      bodyFatPercent: number | null;
      rightArm: number | null;
      rightThigh: number | null;
    },
  >(measurement: T) {
    const { measuredAt, bodyFatPercent, rightArm, rightThigh, ...rest } =
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
        chest: dto.chest,
        waist: dto.waist,
        hips: dto.hips,
        rightArm: dto.arm,
        rightThigh: dto.thigh,
        neck: dto.neck,
        notes: dto.notes,
      },
    });
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
        chest: dto.chest,
        waist: dto.waist,
        hips: dto.hips,
        rightArm: dto.arm,
        rightThigh: dto.thigh,
        neck: dto.neck,
        notes: dto.notes,
      },
    });
    return this.toResponse(measurement);
  }

  async remove(id: string, currentUser: CurrentUserPayload) {
    await this.findOne(id, currentUser);
    await this.prisma.bodyMeasurement.delete({ where: { id } });
  }
}
