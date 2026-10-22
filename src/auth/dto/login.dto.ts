import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({
    example: 'personal01',
    description: 'Campo legado; prefira identifier.',
    minLength: 1,
    maxLength: 254,
  })
  @ValidateIf((o) => !o.identifier)
  @IsNotEmpty({ message: 'identifier ou username deve ser informado.' })
  @IsString()
  @MaxLength(254)
  username?: string;

  @ApiPropertyOptional({
    example: 'user@domain.com',
    description: 'Username ou e-mail de acesso.',
    minLength: 1,
    maxLength: 254,
  })
  @ValidateIf((o) => !o.username)
  @IsNotEmpty({ message: 'identifier ou username deve ser informado.' })
  @IsString()
  @MaxLength(254)
  identifier?: string;

  @ApiPropertyOptional({ example: 'Senha@123', minLength: 4, maxLength: 128 })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(128)
  password: string;
}
