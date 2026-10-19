export declare class StorageService {
    private s3;
    private bucket;
    private publicEndpoint;
    private static readonly ALLOWED_MIMETYPES;
    private static readonly MAX_SIZE;
    constructor();
    validateImage(file: Express.Multer.File): void;
    uploadImage(file: Express.Multer.File, path: string): Promise<{
        key: string;
        url: string;
    }>;
    uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;
    getSignedUrl(key: string, expiresIn?: number): Promise<string>;
    deleteFile(key: string): Promise<void>;
    private upload;
}
