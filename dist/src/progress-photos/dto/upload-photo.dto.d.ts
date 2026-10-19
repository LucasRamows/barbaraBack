import { PhotoPosition } from '@prisma/client';
export declare class UploadPhotoDto {
    studentId: string;
    takenAt?: string;
    position: PhotoPosition;
    observations?: string;
}
