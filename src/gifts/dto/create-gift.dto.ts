import { IsOptional, IsString } from 'class-validator';

export class CreateGiftDto {
  @IsString() studentId: string;
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
}
