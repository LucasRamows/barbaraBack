import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';
interface JwtPayload {
    sub: string;
    role: Role;
    iat?: number;
    exp?: number;
}
export declare class AuthService {
    private prisma;
    private readonly jwtSecret;
    private readonly accessTokenTtl;
    private readonly refreshTokenTtl;
    constructor(prisma: PrismaService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        mustChangePassword: boolean;
        user: {
            id: string;
            username: string;
            role: import("@prisma/client").$Enums.Role;
            name: string;
        };
    }>;
    refresh(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(token: string): Promise<void>;
    verifyAccessToken(token: string): JwtPayload;
    private signAccessToken;
    private createRefreshToken;
}
export {};
