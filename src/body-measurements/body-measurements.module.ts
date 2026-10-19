import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BodyMeasurementsService } from './body-measurements.service';
import { BodyMeasurementsController } from './body-measurements.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BodyMeasurementsController],
  providers: [BodyMeasurementsService],
})
export class BodyMeasurementsModule {}
