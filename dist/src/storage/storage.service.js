"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
let StorageService = class StorageService {
    s3Client;
    bucketName;
    constructor() {
        this.bucketName = process.env.MINIO_BUCKET || 'barbara-bucket';
        this.s3Client = new client_s3_1.S3Client({
            region: process.env.MINIO_REGION || 'us-east-1',
            endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
            credentials: {
                accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
                secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
            },
            forcePathStyle: true,
        });
    }
    async uploadFile(file, folder = 'uploads') {
        try {
            const extension = file.originalname.split('.').pop();
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `${folder}/${uniqueSuffix}.${extension}`;
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: filename,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));
            const endpointUrl = (process.env.MINIO_ENDPOINT || 'http://localhost:9000').replace(/\/$/, '');
            const publicEndpoint = process.env.MINIO_PUBLIC_URL
                ? process.env.MINIO_PUBLIC_URL.replace(/\/$/, '')
                : `${endpointUrl}/${this.bucketName}`;
            return `${publicEndpoint}/${filename}`;
        }
        catch (error) {
            console.error("Erro no Minio upload: ", error);
            throw new common_1.InternalServerErrorException('Erro ao fazer upload do ficheiro');
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map