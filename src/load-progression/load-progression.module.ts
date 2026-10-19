import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LoadProgressionController } from './load-progression.controller';
import { LoadProgressionService } from './load-progression.service';

@Module({
  imports: [PrismaModule],
  controllers: [LoadProgressionController],
  providers: [LoadProgressionService],
  exports: [LoadProgressionService],
})
export class LoadProgressionModule {}
