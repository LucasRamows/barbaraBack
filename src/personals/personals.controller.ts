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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { PersonalsService } from './personals.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('personals')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@Controller('personals')
export class PersonalsController {
  constructor(private readonly personalsService: PersonalsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar personal (SUPER_ADMIN)' })
  @ApiBadRequestResponse({ description: 'Payload fora dos limites do contrato.' })
  @ApiConflictResponse({ description: 'Username, e-mail ou CPF/CNPJ já cadastrado.' })
  create(@Body() dto: CreatePersonalDto) {
    return this.personalsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar personals (SUPER_ADMIN)' })
  findAll() {
    return this.personalsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar personal (SUPER_ADMIN)' })
  findOne(@Param('id') id: string) {
    return this.personalsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar personal (SUPER_ADMIN)' })
  @ApiBadRequestResponse({ description: 'Payload fora dos limites do contrato.' })
  @ApiConflictResponse({ description: 'E-mail ou CPF/CNPJ já cadastrado.' })
  update(@Param('id') id: string, @Body() dto: UpdatePersonalDto) {
    return this.personalsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir personal logicamente (SUPER_ADMIN)' })
  remove(@Param('id') id: string) {
    return this.personalsService.remove(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Bloquear/ativar personal (SUPER_ADMIN)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.personalsService.updateStatus(id, dto.status);
  }

  @Put(':id/reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Redefinir senha do personal (SUPER_ADMIN)' })
  resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return this.personalsService.resetPassword(id, dto.newPassword);
  }
}
