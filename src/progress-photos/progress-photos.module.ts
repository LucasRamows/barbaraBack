import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';
import { ProgressPhotosService } from './progress-photos.service';
import { ProgressPhotosController } from './progress-photos.controller';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [ProgressPhotosController],
  providers: [ProgressPhotosService],
})
export class ProgressPhotosModule {}
