import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutSetsService } from './workout-sets.service';
import { UpdateWorkoutSetDto } from './dto/update-set.dto';

@ApiTags('workout-sets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ALUNO)
@Controller('workout-sets')
export class WorkoutSetsController {
  constructor(private readonly service: WorkoutSetsService) {}

  @ApiOperation({ summary: 'Atualizar série executada' })
  @Put(':setId')
  update(
    @Param('setId') setId: string,
    @Body() dto: UpdateWorkoutSetDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.update(setId, dto, user);
  }

  @ApiOperation({ summary: 'Adicionar série extra ao exercício' })
  @Post(':sessionExerciseId/extra')
  addExtraSet(
    @Param('sessionExerciseId') sessionExerciseId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.addExtraSet(sessionExerciseId, user);
  }
}
