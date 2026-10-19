import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateMyProfileDto {
  @IsString()
  name: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
