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
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotesService = class NotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createNote(data, userId) {
        try {
            const { title, content, folder } = data;
            return await this.prisma.note.create({
                data: {
                    title: title || 'Sem título',
                    content,
                    folder: folder || 'Geral',
                    userId,
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao criar nota' });
        }
    }
    async getNotes(folder, userId) {
        try {
            return await this.prisma.note.findMany({
                where: {
                    userId,
                    ...(folder ? { folder: String(folder) } : {}),
                },
                orderBy: { updatedAt: 'desc' },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: 'Erro ao buscar notas' });
        }
    }
    async updateNote(id, data) {
        try {
            const { title, content, folder } = data;
            return await this.prisma.note.update({
                where: { id },
                data: { title, content, folder },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao salvar nota' });
        }
    }
    async deleteNote(id) {
        try {
            await this.prisma.note.delete({ where: { id } });
            return;
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao excluir nota' });
        }
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotesService);
//# sourceMappingURL=notes.service.js.map