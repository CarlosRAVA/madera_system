import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const TIME_REGEX = /^([01]?\d|2[0-3]):[0-5]\d$/;

export class UpdateBusinessConfigDto {
  @ApiPropertyOptional({ example: 'Leños Rellenos' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  businessName?: string;

  @ApiPropertyOptional({
    example: '+525512345678',
    description: 'Número de WhatsApp usado para recibir pedidos (RF3/RF4)',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\+?\d{8,15}$/, {
    message: 'whatsappNumber debe tener entre 8 y 15 dígitos, con "+" opcional',
  })
  whatsappNumber?: string;

  @ApiPropertyOptional({
    example: 'Fracc. La Paz, Dolores Hidalgo, Guanajuato',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ example: 0, description: 'Costo de envío en MXN' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  deliveryFee?: number;

  @ApiPropertyOptional({
    example: true,
    description:
      'Interruptor manual: si es false, el negocio se muestra cerrado sin importar el horario (ej. vacaciones)',
  })
  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;

  @ApiPropertyOptional({
    example: '09:00',
    description: 'Hora de apertura (HH:mm)',
  })
  @IsString()
  @IsOptional()
  @Matches(TIME_REGEX, { message: 'openingTime debe tener formato HH:mm' })
  openingTime?: string;

  @ApiPropertyOptional({
    example: '22:00',
    description: 'Hora de cierre (HH:mm)',
  })
  @IsString()
  @IsOptional()
  @Matches(TIME_REGEX, { message: 'closingTime debe tener formato HH:mm' })
  closingTime?: string;
}
