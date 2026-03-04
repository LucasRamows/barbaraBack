import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async register(data: any) {
    try {
      const { name, email, password, birthDay, phone, role } = data;

      if (!name || !email || !password) {
        throw new BadRequestException({ error: "Nome, email e senha são obrigatórios." });
      }

      const userExists = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { phone: phone || undefined },
          ],
        },
      });

      if (userExists) {
        throw new BadRequestException({ error: "Email ou telefone já cadastrados." });
      }

      const hashedKey = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          birthDay,
          phone,
          role: role || "USER",
          key: hashedKey,
          settings: {
            create: {
              publicKey: "",
              notifyCalendar: true
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return {
        message: "Usuário criado com sucesso!",
        user: newUser,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException({ error: "Erro interno ao processar o cadastro." });
    }
  }

  async login(data: any) {
    const { email, password } = data;

    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user || !user.key) {
        throw new BadRequestException({ error: "Credenciais inválidas." });
      }

      const isMatch = await bcrypt.compare(password, user.key);
      if (!isMatch) {
        throw new BadRequestException({ error: "Credenciais inválidas." });
      }

      const SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_aqui";
      const token = jwt.sign(
        { id: user.id, role: user.role }, 
        SECRET_KEY, 
      );

      return { 
        token, 
        user: { 
          id: user.id,
          name: user.name, 
          role: user.role 
        } 
      };
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException({ error: "Erro no servidor." });
    }
  }
}
