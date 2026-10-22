import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Role, UserStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';

class AdminUpdateStatusDto {
  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  @IsEnum(UserStatus) status: UserStatus;
}

@ApiTags('admin')
@ApiBearerAuth()
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
    @Body() dto: AdminUpdateStatusDto,
  ) {
    return this.adminService.updatePersonalStatus(userId, dto.status);
  }
}
