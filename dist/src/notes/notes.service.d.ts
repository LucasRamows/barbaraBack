import { PrismaService } from '../prisma/prisma.service';
export declare class NotesService {
    private prisma;
    constructor(prisma: PrismaService);
    createNote(data: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        folder: string | null;
    }>;
    getNotes(folder: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        folder: string | null;
    }[]>;
    updateNote(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        folder: string | null;
    }>;
    deleteNote(id: string): Promise<void>;
}
