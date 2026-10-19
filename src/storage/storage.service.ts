import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket: string;
  private publicEndpoint: string;

  private static readonly ALLOWED_MIMETYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  private static readonly MAX_SIZE = 5 * 1024 * 1024;

  constructor() {
    const region = process.env.S3_REGION ?? 'sa-east-1';
    this.bucket = process.env.S3_BUCKET ?? 'barbara-assets';
    const customEndpoint = process.env.S3_ENDPOINT?.replace(/\/$/, '');

    const publicUrl = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');
    this.publicEndpoint = publicUrl
      ? `${publicUrl}`
      : `https://${this.bucket}.s3.${region}.amazonaws.com`;

    const clientConfig: ConstructorParameters<typeof S3Client>[0] = {
      region,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.S3_SECRET_KEY ?? '',
      },
    };

    // S3_ENDPOINT só deve ser definido para MinIO ou S3-compatível local
    if (customEndpoint) {
      clientConfig.endpoint = customEndpoint;
      clientConfig.forcePathStyle = true;
    }

    this.s3 = new S3Client(clientConfig);
  }

  validateImage(file: Express.Multer.File): void {
    if (!StorageService.ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato inválido. Envie uma imagem JPEG, PNG, WebP ou GIF.',
      );
    }
    if (file.size > StorageService.MAX_SIZE) {
      throw new BadRequestException('Imagem excede o limite de 5 MB.');
    }
    const buf = file.buffer;
    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    const isPng =
      buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    const isWebp =
      buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
    if (!isJpeg && !isPng && !isWebp) {
      throw new BadRequestException('Assinatura do arquivo inválida.');
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    path: string,
  ): Promise<{ key: string; url: string }> {
    this.validateImage(file);
    return this.upload(file.buffer, path, file.mimetype);
  }

  async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    const suffix = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const ext = file.originalname.split('.').pop() ?? 'bin';
    const key = `${folder}/${suffix}.${ext}`;
    const result = await this.upload(file.buffer, key, file.mimetype);
    return result.url;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getSignedUrl(this.s3 as any, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    } catch {
      throw new InternalServerErrorException('Erro ao remover arquivo do storage.');
    }
  }

  private async upload(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<{ key: string; url: string }> {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }),
      );
      return { key, url: `${this.publicEndpoint}/${key}` };
    } catch {
      throw new InternalServerErrorException('Erro ao fazer upload do arquivo.');
    }
  }
}
