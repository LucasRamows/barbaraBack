import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async createNote(data: any, userId: string) {
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
    } catch (error) {
      throw new BadRequestException({ error: 'Erro ao criar nota' });
    }
  }

  async getNotes(folder: string, userId: string) {
    try {
      return await this.prisma.note.findMany({
        where: {
          userId,
          ...(folder ? { folder: String(folder) } : {}),
        },
        orderBy: { updatedAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException({ error: 'Erro ao buscar notas' });
    }
  }

  async updateNote(id: string, data: any) {
    try {
      const { title, content, folder } = data;
      return await this.prisma.note.update({
        where: { id },
        data: { title, content, folder },
      });
    } catch (error) {
      throw new BadRequestException({ error: 'Erro ao salvar nota' });
    }
  }

  async deleteNote(id: string) {
    try {
      await this.prisma.note.delete({ where: { id } });
      return;
    } catch (error) {
      throw new BadRequestException({ error: 'Erro ao excluir nota' });
    }
  }
}
