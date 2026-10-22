import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { BodyMeasurementsService } from './body-measurements.service';
import { CreateBodyMeasurementDto } from './dto/create-body-measurement.dto';
import { UpdateBodyMeasurementDto } from './dto/update-body-measurement.dto';

@ApiTags('body-measurements')
@ApiBearerAuth()
@Controller('body-measurements')
export class BodyMeasurementsController {
  constructor(private readonly service: BodyMeasurementsService) {}

  @Post()
  @Roles(Role.PERSONAL)
  @ApiOperation({ summary: 'Registrar medidas corporais de um aluno' })
  create(
    @Body() dto: CreateBodyMeasurementDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.service.create(dto, currentUser);
  }

  @Get()
  @Roles(Role.ALUNO, Role.PERSONAL, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Listar medidas corporais de um aluno' })
  findAll(
    @Query('studentId') studentId: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.service.findAll(studentId, currentUser);
  }

  @Get('progress')
  @Roles(Role.ALUNO, Role.PERSONAL, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Resumo de evolução corporal e cadência de treinos' })
  getProgress(
    @Query('studentId') studentId: string,
    @Query('from') from: string | undefined,
    @Query('to') to: string | undefined,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.service.getProgress(studentId, from, to, currentUser);
  }

  @Get(':id')
  @Roles(Role.ALUNO, Role.PERSONAL, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Buscar uma medida corporal por ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.service.findOne(id, currentUser);
  }

  @Put(':id')
  @Roles(Role.PERSONAL)
  @ApiOperation({ summary: 'Atualizar medida corporal' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBodyMeasurementDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.service.update(id, dto, currentUser);
  }

  @Delete(':id')
  @Roles(Role.PERSONAL)
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover medida corporal' })
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.service.remove(id, currentUser);
  }
}
