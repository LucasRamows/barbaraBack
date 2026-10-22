import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddressDto {
  @ApiProperty({ example: '41820-021' })
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP deve conter 8 dígitos.' })
  cep: string;

  @ApiProperty({ example: 'Rua das Flores', maxLength: 160 })
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  street: string;

  @ApiProperty({ example: '123', maxLength: 30 })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  streetNumber: string;

  @ApiProperty({ example: 'Pituba', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  neighborhood: string;

  @ApiProperty({ example: 'Salvador', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'BA' })
  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Za-z]{2}$/)
  uf: string;

  @ApiPropertyOptional({ example: 'Brasil', maxLength: 80 })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @ApiPropertyOptional({ example: 'Apto 301', maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  complement?: string | null;

  @ApiPropertyOptional({ example: '2927408', maxLength: 12 })
  @IsOptional()
  @IsString()
  @Matches(/^\d{1,12}$/)
  ibgeCode?: string | null;
}
