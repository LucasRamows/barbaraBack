import { Module } from '@nestjs/common';
import { RewardAchievementsController } from './reward-achievements.controller';
import { RewardAchievementsService } from './reward-achievements.service';

@Module({
  controllers: [RewardAchievementsController],
  providers: [RewardAchievementsService],
  exports: [RewardAchievementsService],
})
export class RewardAchievementsModule {}
