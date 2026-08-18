import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    example: true,
    description:
      'Disponibilidad del producto para los clientes (false = oculto del catálogo)',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
