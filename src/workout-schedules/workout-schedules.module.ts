import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkoutSchedulesController } from './workout-schedules.controller';
import { WorkoutSchedulesService } from './workout-schedules.service';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutSchedulesController],
  providers: [WorkoutSchedulesService],
})
export class WorkoutSchedulesModule {}
