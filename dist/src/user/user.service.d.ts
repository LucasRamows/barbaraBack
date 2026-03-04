import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    updateUser(data: any, userId: string): Promise<{
        id: string;
        name: string;
        email: string;
    }>;
}
