import { PrismaService } from '../prisma/prisma.service';
export declare class PublicService {
    private prisma;
    constructor(prisma: PrismaService);
    register(data: any): Promise<{
        message: string;
        user: {
            id: string;
            createdAt: Date;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    login(data: any): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
}
