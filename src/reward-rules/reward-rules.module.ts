import { Module } from '@nestjs/common';
import { RewardRulesController } from './reward-rules.controller';
import { RewardRulesService } from './reward-rules.service';

@Module({
  controllers: [RewardRulesController],
  providers: [RewardRulesService],
  exports: [RewardRulesService],
})
export class RewardRulesModule {}
