import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MiPassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiPropertyOptional({ example: '+504 9999-9999' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;
}
