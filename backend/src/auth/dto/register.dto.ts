import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name!: string;

  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email!: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  phone?: string;

  /**
   * NOTA: el modelo User actual no tiene columna "address".
   * Se acepta en el DTO para cumplir el contrato de la API,
   * pero se ignora al momento de crear el usuario.
   * Si en el futuro se agrega la columna (o un modelo Address),
   * conectar acá.
   */
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  address?: string;
}
