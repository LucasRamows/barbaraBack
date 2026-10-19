import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DeloadsController } from './deloads.controller';
import { DeloadsService } from './deloads.service';

@Module({
  imports: [PrismaModule],
  controllers: [DeloadsController],
  providers: [DeloadsService],
  exports: [DeloadsService],
})
export class DeloadsModule {}
