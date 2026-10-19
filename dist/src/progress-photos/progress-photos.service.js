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
exports.ProgressPhotosService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let ProgressPhotosService = class ProgressPhotosService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async assertAccess(userId, role, studentId) {
        if (role === client_1.Role.ALUNO) {
            const profile = await this.prisma.studentProfile.findUnique({
                where: { userId },
            });
            if (!profile || profile.id !== studentId) {
                throw new common_1.ForbiddenException('Acesso negado.');
            }
            return;
        }
        if (role === client_1.Role.PERSONAL) {
            const personal = await this.prisma.personalProfile.findUnique({
                where: { userId, deletedAt: null },
            });
            if (!personal)
                throw new common_1.ForbiddenException('Perfil de personal não encontrado.');
            const link = await this.prisma.personalStudent.findFirst({
                where: { personalId: personal.id, studentId },
            });
            if (!link)
                throw new common_1.ForbiddenException('Aluno não pertence a este personal.');
            return;
        }
        if (role === client_1.Role.SUPER_ADMIN) {
            const personal = await this.prisma.personalProfile.findUnique({
                where: { userId, deletedAt: null },
            });
            if (!personal) {
                throw new common_1.ForbiddenException('Super Admin sem vínculo com este aluno não pode acessar dados sensíveis.');
            }
            const link = await this.prisma.personalStudent.findFirst({
                where: { personalId: personal.id, studentId },
            });
            if (!link) {
                throw new common_1.ForbiddenException('Super Admin sem vínculo com este aluno não pode acessar dados sensíveis.');
            }
        }
    }
    async upload(file, dto, currentUser) {
        await this.assertAccess(currentUser.sub, currentUser.role, dto.studentId);
        this.storage.validateImage(file);
        const path = `students/${dto.studentId}/progress/${Date.now()}-${crypto.randomUUID()}`;
        const { key } = await this.storage.uploadImage(file, path);
        const photo = await this.prisma.progressPhoto.create({
            data: {
                studentId: dto.studentId,
                takenAt: dto.takenAt ? new Date(dto.takenAt) : new Date(),
                fileKey: key,
                fileUrl: key,
                position: dto.position,
                observations: dto.observations,
                uploadedById: currentUser.sub,
            },
        });
        const signedUrl = await this.storage.getSignedUrl(key);
        const { fileUrl: _u, fileKey: _k, ...safePhoto } = photo;
        return { ...safePhoto, signedUrl };
    }
    async findAll(studentId, position, currentUser) {
        await this.assertAccess(currentUser.sub, currentUser.role, studentId);
        const photos = await this.prisma.progressPhoto.findMany({
            where: {
                studentId,
                deletedAt: null,
                ...(position ? { position } : {}),
            },
            orderBy: { takenAt: 'asc' },
        });
        return Promise.all(photos.map(async ({ fileUrl: _u, fileKey, ...rest }) => {
            const signedUrl = await this.storage.getSignedUrl(fileKey);
            return { ...rest, signedUrl };
        }));
    }
    async findOne(id, currentUser) {
        const photo = await this.prisma.progressPhoto.findFirst({
            where: { id, deletedAt: null },
        });
        if (!photo)
            throw new common_1.NotFoundException('Foto não encontrada.');
        await this.assertAccess(currentUser.sub, currentUser.role, photo.studentId);
        const signedUrl = await this.storage.getSignedUrl(photo.fileKey);
        const { fileUrl: _u, fileKey: _k, ...safePhoto } = photo;
        return { ...safePhoto, signedUrl };
    }
    async remove(id, currentUser) {
        const photo = await this.prisma.progressPhoto.findFirst({
            where: { id, deletedAt: null },
        });
        if (!photo)
            throw new common_1.NotFoundException('Foto não encontrada.');
        await this.assertAccess(currentUser.sub, currentUser.role, photo.studentId);
        await this.storage.deleteFile(photo.fileKey);
        await this.prisma.progressPhoto.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.ProgressPhotosService = ProgressPhotosService;
exports.ProgressPhotosService = ProgressPhotosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ProgressPhotosService);
//# sourceMappingURL=progress-photos.service.js.map