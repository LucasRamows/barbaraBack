import { Module } from '@nestjs/common';
import { PersonalsController } from './personals.controller';
import { PersonalsService } from './personals.service';

@Module({
  controllers: [PersonalsController],
  providers: [PersonalsService],
  exports: [PersonalsService],
})
export class PersonalsModule {}
