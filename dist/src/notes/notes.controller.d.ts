import { NotesService } from './notes.service';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    createNote(body: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        folder: string | null;
    }>;
    getNotes(folder: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        folder: string | null;
    }[]>;
    updateNote(id: string, body: any): Promise<{
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
