import { Role } from '@prisma/client';

export class UserResponseDto {
  id!: number;
  email!: string;
  fullName!: string;
  phone!: string | null;
  role!: Role;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export class AuthResponseDto {
  user!: UserResponseDto;
  accessToken!: string;
}

export class LoginResponseDto {
  user!: UserResponseDto;
  accessToken!: string;
  refreshToken!: string;
}
