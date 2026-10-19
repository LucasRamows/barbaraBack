"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let ExercisesService = class ExercisesService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async getPersonal(userId) {
        const profile = await this.prisma.personalProfile.findUnique({
            where: { userId, deletedAt: null },
        });
        if (!profile)
            throw new common_1.ForbiddenException('Perfil de personal não encontrado.');
        return profile;
    }
    async getOwned(id, personalId) {
        const exercise = await this.prisma.exercise.findFirst({
            where: { id, personalId, deletedAt: null },
            include: { images: { orderBy: { order: 'asc' } } },
        });
        if (!exercise)
            throw new common_1.NotFoundException('Exercício não encontrado.');
        return exercise;
    }
    async create(dto, currentUser) {
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
    async findAll(currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        return this.prisma.exercise.findMany({
            where: { personalId: personal.id, deletedAt: null },
            include: { images: { orderBy: { order: 'asc' } } },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        return this.getOwned(id, personal.id);
    }
    async update(id, dto, currentUser) {
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
    async remove(id, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwned(id, personal.id);
        await this.prisma.exercise.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async addImage(id, file, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwned(id, personal.id);
        const suffix = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { key, url } = await this.storage.uploadImage(file, `exercises/${id}/images/${suffix}`);
        const count = await this.prisma.exerciseImage.count({ where: { exerciseId: id } });
        return this.prisma.exerciseImage.create({
            data: { exerciseId: id, url, order: count },
        });
    }
    async removeImage(id, imageId, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwned(id, personal.id);
        const image = await this.prisma.exerciseImage.findFirst({
            where: { id: imageId, exerciseId: id },
        });
        if (!image)
            throw new common_1.NotFoundException('Imagem não encontrada.');
        await this.prisma.exerciseImage.delete({ where: { id: imageId } });
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map