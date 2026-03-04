import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    createTransaction(body: any, req: any): Promise<{
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
    getTransactions(month: string, year: string, req: any): Promise<{
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
    getSummary(req: any): Promise<any>;
    updateTransaction(id: string, body: any, req: any): Promise<{
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
    deleteTransaction(id: string, req: any): Promise<void>;
    getStatsCategories(req: any): Promise<{
        category: any;
        total: any;
    }[]>;
}
