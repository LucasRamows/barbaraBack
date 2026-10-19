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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

@ApiTags('gifts')
@ApiBearerAuth()
@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Post()
  @Roles(Role.PERSONAL)
  create(@Body() dto: CreateGiftDto, @CurrentUser() user: CurrentUserPayload) {
    return this.giftsService.create(dto, user);
  }

  @Get()
  @Roles(Role.ALUNO, Role.PERSONAL, Role.SUPER_ADMIN)
  findAll(
    @Query('studentId') studentId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.giftsService.findAll(studentId, user);
  }

  @Get(':id')
  @Roles(Role.ALUNO, Role.PERSONAL, Role.SUPER_ADMIN)
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.giftsService.findOne(id, user);
  }

  @Put(':id/deliver')
  @Roles(Role.PERSONAL)
  deliver(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.giftsService.deliver(id, user);
  }

  @Put(':id')
  @Roles(Role.PERSONAL)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGiftDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.giftsService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.PERSONAL)
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.giftsService.remove(id, user);
  }
}
