import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService) {}

  async createCredential(data: any, userId: string) {
    try {
      const { site, email, password } = data;

      if (!site || !email || !password) {
        throw new BadRequestException({ error: "Campos obrigatórios em falta" });
      }

      return await this.prisma.security.create({
        data: {
          site,
          email,
          password,
          userId,
        },
      });
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException({ error: "Erro ao registar credencial", details: error.message });
    }
  }

  async updatePublicKey(key: string, userId: string) {
    try {
      return await this.prisma.settings.update({
        where: { userId },
        data: { publicKey: key },
      });
    } catch (error: any) {
      throw new BadRequestException({ error: "Erro ao registrar key", details: error.message });
    }
  }

  async getPublicKey(userId: string) {
    try {
      return await this.prisma.settings.findMany({ where: { userId } });
    } catch (error) {
      throw new InternalServerErrorException({ error: "Erro ao procurar key" });
    }
  }

  async getCredentials(userId: string) {
    try {
      return await this.prisma.security.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new InternalServerErrorException({ error: "Erro ao procurar credenciais" });
    }
  }

  async updateCredential(id: string, data: any, userId: string) {
    try {
      const { site, email, password } = data;
      return await this.prisma.security.update({
        where: { id, userId },
        data: { site, email, password },
      });
    } catch (error) {
      throw new BadRequestException({ error: "Erro ao atualizar credencial" });
    }
  }

  async deleteCredential(id: string, userId: string) {
    try {
      await this.prisma.security.delete({ where: { id, userId } });
      return;
    } catch (error) {
      throw new BadRequestException({ error: "Erro ao eliminar credencial" });
    }
  }

  async getStats(userId: string) {
    try {
      const count = await this.prisma.security.count({ where: { userId } });
      return { totalCredentials: count };
    } catch (error) {
      throw new InternalServerErrorException({ error: "Erro ao obter estatísticas" });
    }
  }
}
