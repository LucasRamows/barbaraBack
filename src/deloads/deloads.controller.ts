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
import { DeloadsService } from './deloads.service';
import { CreateDeloadDto } from './dto/create-deload.dto';
import { UpdateDeloadDto } from './dto/update-deload.dto';

@ApiTags('deloads')
@ApiBearerAuth()
@Controller('deloads')
export class DeloadsController {
  constructor(private readonly service: DeloadsService) {}

  @ApiOperation({ summary: 'Criar período de deload' })
  @Roles(Role.PERSONAL)
  @Post()
  create(@Body() dto: CreateDeloadDto, @CurrentUser() user: CurrentUserPayload) {
    return this.service.create(dto, user);
  }

  @ApiOperation({ summary: 'Listar períodos de deload' })
  @Roles(Role.PERSONAL, Role.ALUNO)
  @Get()
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query('studentId') studentId?: string,
  ) {
    return this.service.findAll(user, studentId);
  }

  @ApiOperation({ summary: 'Atualizar período de deload' })
  @Roles(Role.PERSONAL)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDeloadDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.update(id, dto, user);
  }

  @ApiOperation({ summary: 'Remover período de deload' })
  @Roles(Role.PERSONAL)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.service.remove(id, user);
  }
}
