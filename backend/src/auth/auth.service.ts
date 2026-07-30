import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  AuthResponseDto,
  LoginResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';

const SALT_ROUNDS = 10;
const GENERIC_AUTH_ERROR = 'Email o contraseña incorrectos';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `Ya existe un usuario registrado con el email ${dto.email}`,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.name,
        phone: dto.phone,
        role: Role.CUSTOMER,
      },
    });

    const accessToken = this.generateAccessToken(user);

    return {
      user: this.toUserResponse(user),
      accessToken,
    };
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Mensaje genérico a propósito: no revelar si el email existe o no.
    if (!user) {
      throw new UnauthorizedException(GENERIC_AUTH_ERROR);
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException(GENERIC_AUTH_ERROR);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    return {
      user: this.toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: User): string {
    const payload = { userId: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: (process.env.JWT_ACCESS_EXPIRATION ??
        '15m') as JwtSignOptions['expiresIn'],
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = { userId: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRATION ??
        '7d') as JwtSignOptions['expiresIn'],
    });
  }

  private toUserResponse(user: User): UserResponseDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashedRefreshToken, ...rest } = user;
    return rest;
  }
}
