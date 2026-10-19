import { PhotoPosition } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { UploadPhotoDto } from './dto/upload-photo.dto';
export declare class ProgressPhotosService {
    private prisma;
    private storage;
    constructor(prisma: PrismaService, storage: StorageService);
    private assertAccess;
    upload(file: Express.Multer.File, dto: UploadPhotoDto, currentUser: CurrentUserPayload): Promise<{
        signedUrl: string;
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        observations: string | null;
        studentId: string;
        takenAt: Date;
        position: import("@prisma/client").$Enums.PhotoPosition;
        category: string | null;
        uploadedById: string;
    }>;
    findAll(studentId: string, position: PhotoPosition | undefined, currentUser: CurrentUserPayload): Promise<{
        signedUrl: string;
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        observations: string | null;
        studentId: string;
        takenAt: Date;
        position: import("@prisma/client").$Enums.PhotoPosition;
        category: string | null;
        uploadedById: string;
    }[]>;
    findOne(id: string, currentUser: CurrentUserPayload): Promise<{
        signedUrl: string;
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        observations: string | null;
        studentId: string;
        takenAt: Date;
        position: import("@prisma/client").$Enums.PhotoPosition;
        category: string | null;
        uploadedById: string;
    }>;
    remove(id: string, currentUser: CurrentUserPayload): Promise<void>;
}
