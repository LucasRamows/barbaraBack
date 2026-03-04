import { PrismaService } from '../prisma/prisma.service';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    createTask(data: any, userId: string): Promise<{
        reminders: {
            id: string;
            time: Date;
            taskId: string;
        }[];
    } & {
        description: string | null;
        type: import("@prisma/client").$Enums.TaskType;
        date: Date | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        name: string;
        isPriority: import("@prisma/client").$Enums.TaskPriority;
        status: boolean;
    }>;
    getTasks(type: string, priority: string, userId: string): Promise<({
        reminders: {
            id: string;
            time: Date;
            taskId: string;
        }[];
    } & {
        description: string | null;
        type: import("@prisma/client").$Enums.TaskType;
        date: Date | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        name: string;
        isPriority: import("@prisma/client").$Enums.TaskPriority;
        status: boolean;
    })[]>;
    updateTask(id: string, data: any, userId: string): Promise<{
        reminders: {
            id: string;
            time: Date;
            taskId: string;
        }[];
    } & {
        description: string | null;
        type: import("@prisma/client").$Enums.TaskType;
        date: Date | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        name: string;
        isPriority: import("@prisma/client").$Enums.TaskPriority;
        status: boolean;
    }>;
    deleteTask(id: string, userId: string): Promise<void>;
    getStatsSummary(userId: string): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.TaskGroupByOutputType, "status"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
