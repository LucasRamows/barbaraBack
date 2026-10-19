import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkoutHistoryController } from './workout-history.controller';
import { WorkoutHistoryService } from './workout-history.service';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutHistoryController],
  providers: [WorkoutHistoryService],
})
export class WorkoutHistoryModule {}
