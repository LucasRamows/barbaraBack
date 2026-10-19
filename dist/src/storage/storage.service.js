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
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let StorageService = class StorageService {
    static { StorageService_1 = this; }
    s3;
    bucket;
    publicEndpoint;
    static ALLOWED_MIMETYPES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ];
    static MAX_SIZE = 5 * 1024 * 1024;
    constructor() {
        const region = process.env.S3_REGION ?? 'sa-east-1';
        this.bucket = process.env.S3_BUCKET ?? 'barbara-assets';
        const customEndpoint = process.env.S3_ENDPOINT?.replace(/\/$/, '');
        const publicUrl = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');
        this.publicEndpoint = publicUrl
            ? `${publicUrl}`
            : `https://${this.bucket}.s3.${region}.amazonaws.com`;
        const clientConfig = {
            region,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY ?? '',
                secretAccessKey: process.env.S3_SECRET_KEY ?? '',
            },
        };
        if (customEndpoint) {
            clientConfig.endpoint = customEndpoint;
            clientConfig.forcePathStyle = true;
        }
        this.s3 = new client_s3_1.S3Client(clientConfig);
    }
    validateImage(file) {
        if (!StorageService_1.ALLOWED_MIMETYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Formato inválido. Envie uma imagem JPEG, PNG, WebP ou GIF.');
        }
        if (file.size > StorageService_1.MAX_SIZE) {
            throw new common_1.BadRequestException('Imagem excede o limite de 5 MB.');
        }
        const buf = file.buffer;
        const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
        const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
        const isWebp = buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
        if (!isJpeg && !isPng && !isWebp) {
            throw new common_1.BadRequestException('Assinatura do arquivo inválida.');
        }
    }
    async uploadImage(file, path) {
        this.validateImage(file);
        return this.upload(file.buffer, path, file.mimetype);
    }
    async uploadFile(file, folder = 'uploads') {
        const suffix = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const ext = file.originalname.split('.').pop() ?? 'bin';
        const key = `${folder}/${suffix}.${ext}`;
        const result = await this.upload(file.buffer, key, file.mimetype);
        return result.url;
    }
    async getSignedUrl(key, expiresIn = 3600) {
        const command = new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: key });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3, command, { expiresIn });
    }
    async deleteFile(key) {
        try {
            await this.s3.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
        }
        catch {
            throw new common_1.InternalServerErrorException('Erro ao remover arquivo do storage.');
        }
    }
    async upload(buffer, key, contentType) {
        try {
            await this.s3.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: contentType,
            }));
            return { key, url: `${this.publicEndpoint}/${key}` };
        }
        catch {
            throw new common_1.InternalServerErrorException('Erro ao fazer upload do arquivo.');
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map