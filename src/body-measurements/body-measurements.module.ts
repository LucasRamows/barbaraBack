import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BodyMeasurementsService } from './body-measurements.service';
import { BodyMeasurementsController } from './body-measurements.controller';
import { RewardAchievementsModule } from '../reward-achievements/reward-achievements.module';

@Module({
  imports: [PrismaModule, RewardAchievementsModule],
  controllers: [BodyMeasurementsController],
  providers: [BodyMeasurementsService],
})
export class BodyMeasurementsModule {}
