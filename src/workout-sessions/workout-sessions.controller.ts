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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutSessionsService } from './workout-sessions.service';
import { StartSessionDto } from './dto/start-session.dto';
import { FinishSessionDto } from './dto/finish-session.dto';

@ApiTags('workout-sessions')
@ApiBearerAuth()
@Controller('workout-sessions')
export class WorkoutSessionsController {
  constructor(private readonly service: WorkoutSessionsService) {}

  @ApiOperation({ summary: 'Buscar sessão ativa do aluno' })
  @Roles(Role.ALUNO)
  @Get('active')
  findActive(@CurrentUser() user: CurrentUserPayload) {
    return this.service.findActive(user);
  }

  @ApiOperation({ summary: 'Iniciar sessão de treino' })
  @Roles(Role.ALUNO)
  @Post('start')
  start(@Body() dto: StartSessionDto, @CurrentUser() user: CurrentUserPayload) {
    return this.service.start(dto, user);
  }

  @ApiOperation({ summary: 'Listar histórico de sessões' })
  @Roles(Role.ALUNO, Role.PERSONAL)
  @Get()
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query('studentId') studentId?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.service.findAll(user, studentId, Number(skip ?? 0), Number(take ?? 20));
  }

  @ApiOperation({ summary: 'Buscar sessão por ID' })
  @Roles(Role.ALUNO, Role.PERSONAL)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Finalizar sessão de treino' })
  @Roles(Role.ALUNO)
  @Put(':id/finish')
  finish(
    @Param('id') id: string,
    @Body() dto: FinishSessionDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.finish(id, dto, user);
  }

  @ApiOperation({ summary: 'Abandonar sessão de treino' })
  @Roles(Role.ALUNO)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  abandon(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.service.abandonSession(id, user);
  }
}
