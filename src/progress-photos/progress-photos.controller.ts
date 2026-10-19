import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PhotoPosition, Role } from '@prisma/client';
import { memoryStorage } from 'multer';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { ProgressPhotosService } from './progress-photos.service';
import { UploadPhotoDto } from './dto/upload-photo.dto';

@ApiTags('progress-photos')
@ApiBearerAuth()
@Controller('progress-photos')
export class ProgressPhotosController {
  constructor(private readonly service: ProgressPhotosService) {}

  @Post()
  @Roles(Role.PERSONAL)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload de foto de progresso de um aluno' })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadPhotoDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.service.upload(file, dto, currentUser);
  }

  @Get()
  @Roles(Role.ALUNO, Role.PERSONAL, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Listar fotos de progresso de um aluno' })
  findAll(
    @Query('studentId') studentId: string,
    @Query('position') position: PhotoPosition | undefined,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.service.findAll(studentId, position, currentUser);
  }

  @Get(':id')
  @Roles(Role.ALUNO, Role.PERSONAL, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Buscar foto de progresso por ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.service.findOne(id, currentUser);
  }

  @Delete(':id')
  @Roles(Role.PERSONAL)
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover foto de progresso' })
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.service.remove(id, currentUser);
  }
}
