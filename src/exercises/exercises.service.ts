import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  private async getPersonal(userId: string) {
    const profile = await this.prisma.personalProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile) throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  private async getOwned(id: string, personalId: string) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id, personalId, deletedAt: null },
      include: { images: { orderBy: { order: 'asc' } } },
    });
    if (!exercise) throw new NotFoundException('Exercício não encontrado.');
    return exercise;
  }

  async create(dto: CreateExerciseDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    return this.prisma.exercise.create({
      data: {
        personalId: personal.id,
        name: dto.name,
        description: dto.description,
        muscleGroup: dto.muscleGroup,
        instructions: dto.instructions,
        isUnilateral: dto.isUnilateral ?? false,
        defaultSets: dto.defaultSets ?? 3,
        minReps: dto.minReps ?? 8,
        maxReps: dto.maxReps ?? 12,
        defaultWeight: dto.defaultWeight,
        weightUnit: dto.weightUnit ?? 'KG',
        restSeconds: dto.restSeconds ?? 60,
        rpeTarget: dto.rpeTarget,
        progressionEnabled: dto.progressionEnabled ?? true,
        suggestedIncrement: dto.suggestedIncrement,
        notes: dto.notes,
      },
      include: { images: true },
    });
  }

  async findAll(currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    return this.prisma.exercise.findMany({
      where: { personalId: personal.id, deletedAt: null },
      include: { images: { orderBy: { order: 'asc' } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    return this.getOwned(id, personal.id);
  }

  async update(id: string, dto: UpdateExerciseDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwned(id, personal.id);
    return this.prisma.exercise.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        muscleGroup: dto.muscleGroup,
        instructions: dto.instructions,
        isUnilateral: dto.isUnilateral,
        defaultSets: dto.defaultSets,
        minReps: dto.minReps,
        maxReps: dto.maxReps,
        defaultWeight: dto.defaultWeight,
        weightUnit: dto.weightUnit,
        restSeconds: dto.restSeconds,
        rpeTarget: dto.rpeTarget,
        progressionEnabled: dto.progressionEnabled,
        suggestedIncrement: dto.suggestedIncrement,
        notes: dto.notes,
        isActive: dto.isActive,
      },
      include: { images: true },
    });
  }

  async remove(id: string, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwned(id, personal.id);
    await this.prisma.exercise.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async addImage(
    id: string,
    file: Express.Multer.File,
    currentUser: CurrentUserPayload,
  ) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwned(id, personal.id);

    const suffix = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const { key, url } = await this.storage.uploadImage(
      file,
      `exercises/${id}/images/${suffix}`,
    );

    const count = await this.prisma.exerciseImage.count({ where: { exerciseId: id } });
    return this.prisma.exerciseImage.create({
      data: { exerciseId: id, url, order: count },
    });
  }

  async removeImage(
    id: string,
    imageId: string,
    currentUser: CurrentUserPayload,
  ) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwned(id, personal.id);

    const image = await this.prisma.exerciseImage.findFirst({
      where: { id: imageId, exerciseId: id },
    });
    if (!image) throw new NotFoundException('Imagem não encontrada.');

    await this.prisma.exerciseImage.delete({ where: { id: imageId } });
  }
}
