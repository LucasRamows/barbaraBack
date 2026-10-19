import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkoutSetsController } from './workout-sets.controller';
import { WorkoutSetsService } from './workout-sets.service';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutSetsController],
  providers: [WorkoutSetsService],
})
export class WorkoutSetsModule {}
