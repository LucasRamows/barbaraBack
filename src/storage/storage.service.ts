import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.MINIO_BUCKET || 'barbara-bucket';
    
    this.s3Client = new S3Client({
      region: process.env.MINIO_REGION || 'us-east-1',
      endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      },
      forcePathStyle: true, // required for Minio
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    try {
      const extension = file.originalname.split('.').pop();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `${folder}/${uniqueSuffix}.${extension}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const endpointUrl = (process.env.MINIO_ENDPOINT || 'http://localhost:9000').replace(/\/$/, '');
      
      // Use public endpoint if defined (e.g., CDN or external DNS mapping)
      const publicEndpoint = process.env.MINIO_PUBLIC_URL 
          ? process.env.MINIO_PUBLIC_URL.replace(/\/$/, '') 
          : `${endpointUrl}/${this.bucketName}`;

      return `${publicEndpoint}/${filename}`;
    } catch (error) {
      console.error("Erro no Minio upload: ", error);
      throw new InternalServerErrorException('Erro ao fazer upload do ficheiro');
    }
  }
}
