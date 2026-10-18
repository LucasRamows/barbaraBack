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
import { Role, UserStatus } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStatusDto } from '../personals/dto/update-status.dto';
import { ResetPasswordDto } from '../personals/dto/reset-password.dto';

@ApiTags('students')
@ApiBearerAuth()
@Roles(Role.PERSONAL)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar aluno (PERSONAL)' })
  create(
    @Body() dto: CreateStudentDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.studentsService.create(dto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Listar alunos do personal' })
  findAll(@CurrentUser() currentUser: CurrentUserPayload) {
    return this.studentsService.findAll(currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar aluno' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.studentsService.findOne(id, currentUser);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar aluno' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.studentsService.update(id, dto, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir aluno logicamente' })
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.studentsService.remove(id, currentUser);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Bloquear/ativar aluno' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.studentsService.updateStatus(id, dto.status, currentUser);
  }

  @Put(':id/reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Redefinir senha do aluno' })
  resetPassword(
    @Param('id') id: string,
    @Body() dto: ResetPasswordDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.studentsService.resetPassword(id, dto.newPassword, currentUser);
  }
}
