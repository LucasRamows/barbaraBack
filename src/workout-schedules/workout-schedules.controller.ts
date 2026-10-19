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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutSchedulesService } from './workout-schedules.service';
import { CreateWorkoutScheduleDto } from './dto/create-schedule.dto';
import { UpdateWorkoutScheduleDto } from './dto/update-schedule.dto';

@ApiTags('workout-schedules')
@ApiBearerAuth()
@Roles(Role.PERSONAL)
@Controller('workout-schedules')
export class WorkoutSchedulesController {
  constructor(private readonly service: WorkoutSchedulesService) {}

  @ApiOperation({ summary: 'Criar ou atualizar programação semanal do aluno' })
  @Post()
  create(@Body() dto: CreateWorkoutScheduleDto, @CurrentUser() user: CurrentUserPayload) {
    return this.service.create(dto, user);
  }

  @ApiOperation({ summary: 'Listar programação semanal do aluno' })
  @ApiQuery({ name: 'studentId', required: true })
  @Get()
  findByStudent(@Query('studentId') studentId: string, @CurrentUser() user: CurrentUserPayload) {
    return this.service.findByStudent(studentId, user);
  }

  @ApiOperation({ summary: 'Atualizar programação' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkoutScheduleDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.update(id, dto, user);
  }

  @ApiOperation({ summary: 'Remover programação' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.service.remove(id, user);
  }
}
