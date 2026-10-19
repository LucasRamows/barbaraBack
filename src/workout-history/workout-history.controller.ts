import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutHistoryService } from './workout-history.service';

@ApiTags('workout-history')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workout-history')
export class WorkoutHistoryController {
  constructor(private readonly service: WorkoutHistoryService) {}

  @ApiOperation({ summary: 'Histórico de carga de um exercício' })
  @Roles(Role.ALUNO, Role.PERSONAL)
  @Get('exercise')
  getExerciseHistory(
    @CurrentUser() user: CurrentUserPayload,
    @Query('exerciseId') exerciseId: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.service.getExerciseHistory(exerciseId, user, studentId);
  }
}
