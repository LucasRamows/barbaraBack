import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { RewardRulesService } from './reward-rules.service';
import { CreateRewardRuleDto } from './dto/create-reward-rule.dto';
import { UpdateRewardRuleDto } from './dto/update-reward-rule.dto';

@ApiTags('reward-rules')
@ApiBearerAuth()
@Controller('reward-rules')
export class RewardRulesController {
  constructor(private readonly rewardRulesService: RewardRulesService) {}

  @Get()
  @Roles(Role.PERSONAL, Role.SUPER_ADMIN)
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.rewardRulesService.findAll(user);
  }

  @Post()
  @Roles(Role.PERSONAL)
  create(@Body() dto: CreateRewardRuleDto, @CurrentUser() user: CurrentUserPayload) {
    return this.rewardRulesService.create(dto, user);
  }

  @Put(':id')
  @Roles(Role.PERSONAL)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRewardRuleDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.rewardRulesService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.PERSONAL)
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.rewardRulesService.remove(id, user);
  }
}
