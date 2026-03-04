import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    createTask(body: any, req: any): Promise<{
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
    getTasks(type: string, priority: string, req: any): Promise<({
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
    updateTask(id: string, body: any, req: any): Promise<{
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
    deleteTask(id: string, req: any): Promise<void>;
    getStatsSummary(req: any): Promise<(import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.TaskGroupByOutputType, "status"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
