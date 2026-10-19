import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RewardAchievementStatus, Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { RewardAchievementsService } from './reward-achievements.service';

class UpdateAchievementStatusDto {
  @IsEnum(RewardAchievementStatus) status: RewardAchievementStatus;
  @IsOptional() @IsString() notes?: string;
}

@ApiTags('reward-achievements')
@ApiBearerAuth()
@Controller('reward-achievements')
export class RewardAchievementsController {
  constructor(private readonly service: RewardAchievementsService) {}

  @Post('check/:studentId')
  @Roles(Role.PERSONAL)
  checkAndUpdate(
    @Param('studentId') studentId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.checkAndUpdate(studentId, user);
  }

  @Get()
  @Roles(Role.ALUNO, Role.PERSONAL)
  findAchievements(
    @Query('studentId') studentId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.findAchievements(studentId, user);
  }

  @Get('progress')
  @Roles(Role.ALUNO, Role.PERSONAL)
  getProgress(
    @Query('studentId') studentId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.getProgress(studentId, user);
  }

  @Put(':id/status')
  @Roles(Role.PERSONAL, Role.ALUNO)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAchievementStatusDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.updateStatus(id, dto.status, user, dto.notes);
  }
}
