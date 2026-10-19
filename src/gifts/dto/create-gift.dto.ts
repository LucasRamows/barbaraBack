import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateGiftDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() instructions?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
