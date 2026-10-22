import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { RewardAchievementsService } from './reward-achievements.service';
import { UpdateAchievementStatusDto } from './dto/update-achievement-status.dto';

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

  @Post('process-jobs')
  @Roles(Role.PERSONAL, Role.SUPER_ADMIN)
  processJobs(@CurrentUser() user: CurrentUserPayload) {
    return this.service.processPendingJobs(user);
  }

  @Post('jobs/:id/reprocess')
  @Roles(Role.PERSONAL, Role.SUPER_ADMIN)
  reprocessJob(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.service.reprocessJob(id, user);
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
  @Roles(Role.PERSONAL)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAchievementStatusDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.updateStatus(id, dto.status, user, dto.notes);
  }

  @Put(':id/acknowledge')
  @Roles(Role.ALUNO)
  acknowledge(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.acknowledge(id, user);
  }
}
