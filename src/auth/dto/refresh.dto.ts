import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ example: 'f4f9a1…', maxLength: 512 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  refreshToken: string;
}
