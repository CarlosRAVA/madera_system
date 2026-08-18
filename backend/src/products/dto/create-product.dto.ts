import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsPositive,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 1,
    description: 'Id de la categoría a la que pertenece el producto',
  })
  @IsInt()
  @IsPositive()
  categoryId: number;

  @ApiProperty({ example: 'Leño Clásico' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Tortilla de maíz rellena con frijoles, queso y salsa roja.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 35.0, description: 'Precio en MXN' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({
    example: 'https://cdn.lenosrellenos.com/leno-clasico.jpg',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  imageUrl?: string;

  @ApiProperty({
    example: 50,
    description: 'Cantidad disponible en inventario',
  })
  @IsInt()
  @Min(0)
  stock: number;
}
