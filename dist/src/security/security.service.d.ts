import { PrismaService } from '../prisma/prisma.service';
export declare class SecurityService {
    private prisma;
    constructor(prisma: PrismaService);
    createCredential(data: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        email: string;
        password: string;
        site: string;
    }>;
    updatePublicKey(key: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notifyCalendar: boolean;
        publicKey: string;
    }>;
    getPublicKey(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notifyCalendar: boolean;
        publicKey: string;
    }[]>;
    getCredentials(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        email: string;
        password: string;
        site: string;
    }[]>;
    updateCredential(id: string, data: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        email: string;
        password: string;
        site: string;
    }>;
    deleteCredential(id: string, userId: string): Promise<void>;
    getStats(userId: string): Promise<{
        totalCredentials: number;
    }>;
}
