export declare class StorageService {
    private s3Client;
    private bucketName;
    constructor();
    uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;
}
