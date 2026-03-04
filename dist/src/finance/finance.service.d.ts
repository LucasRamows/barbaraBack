import { PrismaService } from '../prisma/prisma.service';
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    createTransaction(data: any, userId: string): Promise<{
        description: string;
        amount: number;
        type: import("@prisma/client").$Enums.TransactionType;
        category: string;
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getTransactions(month: string, year: string, userId: string): Promise<{
        description: string;
        amount: number;
        type: import("@prisma/client").$Enums.TransactionType;
        category: string;
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    getSummary(userId: string): Promise<any>;
    updateTransaction(id: string, data: any, userId: string): Promise<{
        description: string;
        amount: number;
        type: import("@prisma/client").$Enums.TransactionType;
        category: string;
        date: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    deleteTransaction(id: string, userId: string): Promise<void>;
    getStatsCategories(userId: string): Promise<{
        category: any;
        total: any;
    }[]>;
}
