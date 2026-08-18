import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @ApiProperty({
    example: false,
    description: 'Activar o desactivar la cuenta del usuario',
  })
  @IsBoolean()
  isActive: boolean;
}
