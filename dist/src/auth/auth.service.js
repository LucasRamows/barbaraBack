"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    jwtSecret;
    accessTokenTtl = 15 * 60;
    refreshTokenTtl = 7 * 24 * 60 * 60;
    constructor(prisma) {
        this.prisma = prisma;
        this.jwtSecret = process.env.JWT_SECRET ?? 'change_me_in_production';
    }
    async login(dto) {
        const invalidCredentials = new common_1.UnauthorizedException('Usuário ou senha inválidos.');
        const user = await this.prisma.user.findFirst({
            where: { username: dto.username, deletedAt: null },
            include: {
                personalProfile: { select: { name: true } },
                studentProfile: { select: { name: true } },
            },
        });
        if (!user)
            throw invalidCredentials;
        const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordMatch)
            throw invalidCredentials;
        if (user.status !== client_1.UserStatus.ACTIVE) {
            throw new common_1.ForbiddenException('Conta inativa ou bloqueada.');
        }
        const accessToken = this.signAccessToken(user.id, user.role);
        const refreshToken = await this.createRefreshToken(user.id);
        const name = user.personalProfile?.name ?? user.studentProfile?.name ?? user.username;
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
    async refresh(token) {
        const record = await this.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!record || record.revokedAt || record.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token inválido ou expirado.');
        }
        if (record.user.status !== client_1.UserStatus.ACTIVE || record.user.deletedAt) {
            throw new common_1.ForbiddenException('Conta inativa ou bloqueada.');
        }
        await this.prisma.refreshToken.update({
            where: { id: record.id },
            data: { revokedAt: new Date() },
        });
        const newAccessToken = this.signAccessToken(record.userId, record.user.role);
        const newRefreshToken = await this.createRefreshToken(record.userId);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    async logout(token) {
        await this.prisma.refreshToken.updateMany({
            where: { token, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        }
        catch {
            throw new common_1.UnauthorizedException('Token inválido ou expirado.');
        }
    }
    signAccessToken(userId, role) {
        return jwt.sign({ sub: userId, role }, this.jwtSecret, {
            expiresIn: this.accessTokenTtl,
        });
    }
    async createRefreshToken(userId) {
        const token = (0, crypto_1.randomBytes)(64).toString('hex');
        const expiresAt = new Date(Date.now() + this.refreshTokenTtl * 1000);
        await this.prisma.refreshToken.create({
            data: { token, userId, expiresAt },
        });
        return token;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map