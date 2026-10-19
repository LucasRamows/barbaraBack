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
exports.BodyMeasurementsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let BodyMeasurementsService = class BodyMeasurementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
    async create(dto, currentUser) {
        await this.assertAccess(currentUser.sub, currentUser.role, dto.studentId);
        return this.prisma.bodyMeasurement.create({
            data: {
                studentId: dto.studentId,
                measuredAt: dto.measuredAt ? new Date(dto.measuredAt) : new Date(),
                measuredById: currentUser.sub,
                weight: dto.weight,
                height: dto.height,
                bodyFatPercent: dto.bodyFatPercent,
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
                notes: dto.notes,
            },
        });
    }
    async findAll(studentId, currentUser) {
        await this.assertAccess(currentUser.sub, currentUser.role, studentId);
        return this.prisma.bodyMeasurement.findMany({
            where: { studentId },
            orderBy: { measuredAt: 'asc' },
        });
    }
    async findOne(id, currentUser) {
        const measurement = await this.prisma.bodyMeasurement.findUnique({
            where: { id },
        });
        if (!measurement)
            throw new common_1.NotFoundException('Medida não encontrada.');
        await this.assertAccess(currentUser.sub, currentUser.role, measurement.studentId);
        return measurement;
    }
    async update(id, dto, currentUser) {
        await this.findOne(id, currentUser);
        return this.prisma.bodyMeasurement.update({
            where: { id },
            data: {
                measuredAt: dto.measuredAt ? new Date(dto.measuredAt) : undefined,
                weight: dto.weight,
                height: dto.height,
                bodyFatPercent: dto.bodyFatPercent,
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
                notes: dto.notes,
            },
        });
    }
    async remove(id, currentUser) {
        await this.findOne(id, currentUser);
        await this.prisma.bodyMeasurement.delete({ where: { id } });
    }
};
exports.BodyMeasurementsService = BodyMeasurementsService;
exports.BodyMeasurementsService = BodyMeasurementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BodyMeasurementsService);
//# sourceMappingURL=body-measurements.service.js.map