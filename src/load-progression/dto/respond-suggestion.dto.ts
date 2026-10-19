import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RespondSuggestionDto {
  @ApiProperty()
  @IsBoolean()
  isAccepted: boolean;
}
