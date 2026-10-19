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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@ApiTags('exercises')
@ApiBearerAuth()
@Roles(Role.PERSONAL)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly service: ExercisesService) {}

  @ApiOperation({ summary: 'Criar exercício' })
  @Post()
  create(@Body() dto: CreateExerciseDto, @CurrentUser() user: CurrentUserPayload) {
    return this.service.create(dto, user);
  }

  @ApiOperation({ summary: 'Listar exercícios do personal' })
  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Buscar exercício por ID' })
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Atualizar exercício' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateExerciseDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.update(id, dto, user);
  }

  @ApiOperation({ summary: 'Remover exercício (exclusão lógica)' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.service.remove(id, user);
  }

  @ApiOperation({ summary: 'Adicionar imagem ao exercício' })
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file'))
  addImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.addImage(id, file, user);
  }

  @ApiOperation({ summary: 'Remover imagem do exercício' })
  @Delete(':id/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.removeImage(id, imageId, user);
  }
}
