import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({
    example: true,
    description:
      'Disponibilidad de la categoría en el catálogo (false = oculta)',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
