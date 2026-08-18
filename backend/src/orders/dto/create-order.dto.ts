import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Matches,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ example: 'Emmanuel Ramos Díaz' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  customerName: string;

  @ApiProperty({ example: '4181234567' })
  @IsString()
  @Matches(/^\+?\d{8,15}$/, {
    message: 'customerPhone debe tener entre 8 y 15 dígitos, con "+" opcional',
  })
  customerPhone: string;

  @ApiProperty({ example: 'Fracc. La Paz, Dolores Hidalgo, Guanajuato' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  deliveryAddress: string;

  @ApiPropertyOptional({ example: 'Sin cebolla por favor' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  observations?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
