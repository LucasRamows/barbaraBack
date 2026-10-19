import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CurrentUserPayload } from '../auth/current-user.decorator';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  private async getPersonalProfile(userId: string) {
    const profile = await this.prisma.personalProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile) throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  private async assertOwnership(personalId: string, studentId: string) {
    const link = await this.prisma.personalStudent.findFirst({
      where: { personalId, studentId },
    });
    if (!link) throw new ForbiddenException('Aluno não pertence a este personal.');
  }

  async create(dto: CreateStudentDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);

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
        role: Role.ALUNO,
        mustChangePassword: true,
        studentProfile: {
          create: {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
            sex: dto.sex,
            height: dto.height,
            objective: dto.objective,
            experienceLevel: dto.experienceLevel,
            restrictions: dto.restrictions,
            observations: dto.observations,
          },
        },
      },
      include: { studentProfile: true },
    });

    // Link student to personal
    await this.prisma.personalStudent.create({
      data: {
        personalId: personal.id,
        studentId: user.studentProfile!.id,
      },
    });

    const { passwordHash: _ph, ...safeUser } = user as any;
    return safeUser;
  }

  async findAll(currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);

    const links = await this.prisma.personalStudent.findMany({
      where: { personalId: personal.id },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return links
      .filter((l) => l.student.deletedAt === null)
      .map((l) => ({
        ...l.student,
        user: l.student.user,
      }));
  }

  async findOne(id: string, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);

    const student = await this.prisma.studentProfile.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            status: true,
            mustChangePassword: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!student) throw new NotFoundException('Aluno não encontrado.');
    await this.assertOwnership(personal.id, id);

    return student;
  }

  async update(id: string, dto: UpdateStudentDto, currentUser: CurrentUserPayload) {
    await this.findOne(id, currentUser); // validates existence and ownership

    return this.prisma.studentProfile.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        sex: dto.sex,
        height: dto.height,
        objective: dto.objective,
        experienceLevel: dto.experienceLevel,
        restrictions: dto.restrictions,
        observations: dto.observations,
      },
    });
  }

  async remove(id: string, currentUser: CurrentUserPayload) {
    const student = await this.findOne(id, currentUser);

    await this.prisma.user.update({
      where: { id: student.user.id },
      data: { deletedAt: new Date(), status: UserStatus.INACTIVE },
    });

    await this.prisma.studentProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updateStatus(id: string, status: UserStatus, currentUser: CurrentUserPayload) {
    const student = await this.findOne(id, currentUser);

    return this.prisma.user.update({
      where: { id: student.user.id },
      data: { status },
      select: { id: true, status: true },
    });
  }

  async resetPassword(id: string, newPassword: string, currentUser: CurrentUserPayload) {
    const student = await this.findOne(id, currentUser);
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: student.user.id },
      data: { passwordHash, mustChangePassword: true },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: student.user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
