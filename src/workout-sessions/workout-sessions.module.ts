import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LoadProgressionModule } from '../load-progression/load-progression.module';
import { WorkoutSessionsController } from './workout-sessions.controller';
import { WorkoutSessionsService } from './workout-sessions.service';
import { RewardAchievementsModule } from '../reward-achievements/reward-achievements.module';

@Module({
  imports: [PrismaModule, LoadProgressionModule, RewardAchievementsModule],
  controllers: [WorkoutSessionsController],
  providers: [WorkoutSessionsService],
  exports: [WorkoutSessionsService],
})
export class WorkoutSessionsModule {}
