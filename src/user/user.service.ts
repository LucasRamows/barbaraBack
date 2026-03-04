import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      if (!user) {
        throw new NotFoundException({ error: 'Usuário não encontrado' });
      }
      return user;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({ error: 'Erro ao buscar dados do perfil', details: error.message });
    }
  }

  async updateUser(data: any, userId: string) {
    try {
      const { name, password } = data;
      const updateData: any = {};
      if (name) updateData.name = name;
      
      if (password) {
        updateData.password = password;
      }

      return await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
        }
      });
    } catch (error) {
      throw new BadRequestException({ error: 'Erro ao atualizar perfil' });
    }
  }
}
