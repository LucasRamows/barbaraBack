import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { LoadProgressionService } from './load-progression.service';
import { RespondSuggestionDto } from './dto/respond-suggestion.dto';

@ApiTags('load-progression')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('load-progression')
export class LoadProgressionController {
  constructor(private readonly service: LoadProgressionService) {}

  @ApiOperation({ summary: 'Listar sugestões de progressão pendentes' })
  @Roles(Role.ALUNO, Role.PERSONAL)
  @Get('suggestions')
  getSuggestions(
    @CurrentUser() user: CurrentUserPayload,
    @Query('studentId') studentId?: string,
  ) {
    return this.service.getSuggestions(user, studentId);
  }

  @ApiOperation({ summary: 'Aceitar ou rejeitar sugestão de progressão' })
  @Roles(Role.ALUNO, Role.PERSONAL)
  @Put('suggestions/:id')
  respondSuggestion(
    @Param('id') id: string,
    @Body() dto: RespondSuggestionDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.service.respondSuggestion(id, dto.isAccepted, user);
  }
}
