import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { Role, UserStatus } from '@prisma/client';

interface JwtPayload {
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly accessTokenTtl = 15 * 60; // 15 minutes in seconds
  private readonly refreshTokenTtl = 7 * 24 * 60 * 60; // 7 days in seconds

  constructor(private prisma: PrismaService) {
    this.jwtSecret = process.env.JWT_SECRET ?? 'change_me_in_production';
  }

  async login(dto: LoginDto) {
    // Generic error to avoid user enumeration
    const invalidCredentials = new UnauthorizedException(
      'Usuário ou senha inválidos.',
    );

    const user = await this.prisma.user.findFirst({
      where: { username: dto.username, deletedAt: null },
      include: {
        personalProfile: { select: { name: true } },
        studentProfile: { select: { name: true } },
      },
    });

    if (!user) throw invalidCredentials;

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw invalidCredentials;

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Conta inativa ou bloqueada.');
    }

    const accessToken = this.signAccessToken(user.id, user.role);
    const refreshToken = await this.createRefreshToken(user.id);

    const name =
      user.personalProfile?.name ?? user.studentProfile?.name ?? user.username;

    return {
      accessToken,
      refreshToken,
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name,
      },
    };
  }

  async refresh(token: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record || record.revokedAt || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }

    if (record.user.status !== UserStatus.ACTIVE || record.user.deletedAt) {
      throw new ForbiddenException('Conta inativa ou bloqueada.');
    }

    // Rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    const newAccessToken = this.signAccessToken(record.userId, record.user.role);
    const newRefreshToken = await this.createRefreshToken(record.userId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(token: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }

  private signAccessToken(userId: string, role: Role): string {
    return jwt.sign({ sub: userId, role }, this.jwtSecret, {
      expiresIn: this.accessTokenTtl,
    });
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + this.refreshTokenTtl * 1000);

    await this.prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });

    return token;
  }
}
