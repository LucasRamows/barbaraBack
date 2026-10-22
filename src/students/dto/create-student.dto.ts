import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Matches,
  Min,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from '../../identity/address.dto';
import { IsCivilDate } from '../../identity/civil-date.validator';

export class CreateStudentDto {
  @ApiPropertyOptional({ example: 'aluno01', minLength: 3, maxLength: 30 })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9._-]+$/)
  username?: string;

  @ApiProperty({ example: 'Senha@123', minLength: 6, maxLength: 128 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @ApiProperty({ example: 'Maria Silva', minLength: 1, maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ example: 'maria@email.com', maxLength: 254 })
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @ApiPropertyOptional({ example: '(11) 99999-0001', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: '529.982.247-25' })
  @IsOptional()
  @IsString()
  @MaxLength(18)
  document?: string;

  @ApiPropertyOptional({ type: AddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiPropertyOptional({
    example: '1995-08-20',
    format: 'date',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
  })
  @IsOptional()
  @IsCivilDate({ allowFuture: false })
  birthDate?: string;

  @ApiPropertyOptional({ example: 'F' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  sex?: string;

  @ApiPropertyOptional({ example: 1.65 })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(2.8)
  height?: number;

  @ApiPropertyOptional({ example: 'Hipertrofia' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  objective?: string;

  @ApiPropertyOptional({ example: 'BEGINNER' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  experienceLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  restrictions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observations?: string;
}
