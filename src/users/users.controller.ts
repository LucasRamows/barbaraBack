import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Retorna dados do usuário autenticado' })
  getMe(@CurrentUser() currentUser: CurrentUserPayload) {
    return this.usersService.getMe(currentUser);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Atualizar o próprio perfil' })
  updateMyProfile(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body() dto: UpdateMyProfileDto,
  ) {
    return this.usersService.updateMyProfile(currentUser, dto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Trocar senha do usuário autenticado' })
  patchPassword(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      currentUser,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Put('me/change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Trocar senha do usuário autenticado' })
  changePassword(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      currentUser,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
