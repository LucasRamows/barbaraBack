import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    createHealth(body: any, req: any): Promise<{
        note: string | null;
        category: string;
        date: Date | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
    }>;
    getHealths(req: any): Promise<{
        note: string | null;
        category: string;
        date: Date | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
    }[]>;
    updateHealth(id: string, body: any, req: any): Promise<{
        note: string | null;
        category: string;
        date: Date | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
    }>;
    deleteHealth(id: string, req: any): Promise<void>;
}
