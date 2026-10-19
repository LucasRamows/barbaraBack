import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutPlansService } from './workout-plans.service';
import { CreateWorkoutPlanDto } from './dto/create-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-plan.dto';
import { CreatePlanDayDto } from './dto/create-plan-day.dto';
import { UpdatePlanDayDto } from './dto/update-plan-day.dto';
import { AddExerciseToDayDto } from './dto/add-exercise-to-day.dto';
import { UpdateExerciseOnDayDto } from './dto/update-exercise-on-day.dto';
import { ReorderExercisesDto } from './dto/reorder-exercises.dto';

@ApiTags('workout-plans')
@ApiBearerAuth()
@Roles(Role.PERSONAL)
@Controller('workout-plans')
export class WorkoutPlansController {
  constructor(private readonly service: WorkoutPlansService) {}

  // ---- PLANS ----

  @ApiOperation({ summary: 'Criar ficha de treino' })
  @Post()
  createPlan(
    @Body() dto: CreateWorkoutPlanDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.createPlan(dto, user);
  }

  @ApiOperation({ summary: 'Listar fichas do personal' })
  @Roles(Role.PERSONAL, Role.ALUNO)
  @Get()
  findAllPlans(@CurrentUser() user: CurrentUserPayload) {
    return this.service.findAllPlans(user);
  }

  @ApiOperation({ summary: 'Buscar ficha com dias e exercícios' })
  @Roles(Role.PERSONAL, Role.ALUNO)
  @Get(':id')
  findOnePlan(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.findOnePlan(id, user);
  }

  @ApiOperation({ summary: 'Atualizar ficha' })
  @Put(':id')
  updatePlan(
    @Param('id') id: string,
    @Body() dto: UpdateWorkoutPlanDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.updatePlan(id, dto, user);
  }

  @ApiOperation({ summary: 'Remover ficha (exclusão lógica)' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removePlan(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.service.removePlan(id, user);
  }

  @ApiOperation({ summary: 'Duplicar ficha' })
  @Post(':id/duplicate')
  duplicatePlan(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.duplicatePlan(id, user);
  }

  // ---- DAYS ----

  @ApiOperation({ summary: 'Adicionar dia à ficha' })
  @Post(':id/days')
  createDay(
    @Param('id') planId: string,
    @Body() dto: CreatePlanDayDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.createDay(planId, dto, user);
  }

  @ApiOperation({ summary: 'Atualizar dia' })
  @Put(':id/days/:dayId')
  updateDay(
    @Param('id') planId: string,
    @Param('dayId') dayId: string,
    @Body() dto: UpdatePlanDayDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.updateDay(planId, dayId, dto, user);
  }

  @ApiOperation({ summary: 'Remover dia' })
  @Delete(':id/days/:dayId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeDay(
    @Param('id') planId: string,
    @Param('dayId') dayId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.removeDay(planId, dayId, user);
  }

  // ---- EXERCISES ON DAY ----

  @ApiOperation({ summary: 'Adicionar exercício ao dia' })
  @Post(':id/days/:dayId/exercises')
  addExercise(
    @Param('id') planId: string,
    @Param('dayId') dayId: string,
    @Body() dto: AddExerciseToDayDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.addExerciseToDay(planId, dayId, dto, user);
  }

  @ApiOperation({ summary: 'Atualizar exercício no dia' })
  @Put(':id/days/:dayId/exercises/:workoutExId')
  updateExercise(
    @Param('id') planId: string,
    @Param('dayId') dayId: string,
    @Param('workoutExId') workoutExId: string,
    @Body() dto: UpdateExerciseOnDayDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.updateExerciseOnDay(
      planId,
      dayId,
      workoutExId,
      dto,
      user,
    );
  }

  @ApiOperation({ summary: 'Remover exercício do dia' })
  @Delete(':id/days/:dayId/exercises/:workoutExId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeExercise(
    @Param('id') planId: string,
    @Param('dayId') dayId: string,
    @Param('workoutExId') workoutExId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.removeExerciseFromDay(planId, dayId, workoutExId, user);
  }

  @ApiOperation({ summary: 'Reordenar exercícios do dia' })
  @Put(':id/days/:dayId/exercises/reorder')
  reorderExercises(
    @Param('id') planId: string,
    @Param('dayId') dayId: string,
    @Body() dto: ReorderExercisesDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.reorderExercises(planId, dayId, dto, user);
  }
}
