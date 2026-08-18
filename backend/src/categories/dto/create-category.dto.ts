import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Clásicos',
    description: 'Nombre único de la categoría',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ example: 'Los leños rellenos de siempre.' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
