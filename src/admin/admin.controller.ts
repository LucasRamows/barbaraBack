import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, UserStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';

class UpdateStatusDto {
  @IsEnum(UserStatus) status: UserStatus;
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
@Roles(Role.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('personals')
  getPersonals() {
    return this.adminService.getPersonals();
  }

  @Put('personals/:userId/status')
  updatePersonalStatus(
    @Param('userId') userId: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.adminService.updatePersonalStatus(userId, dto.status);
  }
}
