import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token não fornecido.');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_aqui') as { id: string, role: string };
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}

import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
