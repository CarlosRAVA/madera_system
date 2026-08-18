import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

// Nunca se expone password ni hashedRefreshToken en las respuestas.
const USER_SAFE_SELECT = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /api/users/me — perfil del usuario autenticado
   */
  async findMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: USER_SAFE_SELECT,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  /**
   * PATCH /api/users/me — actualiza el propio perfil (nombre, teléfono)
   */
  async updateMe(userId: number, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: USER_SAFE_SELECT,
    });
  }

  /**
   * GET /api/users — panel de administración (solo ADMIN)
   */
  async findAllAdmin() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: USER_SAFE_SELECT,
    });
  }

  /**
   * PATCH /api/users/:id/status — activa/desactiva una cuenta (solo ADMIN).
   * Regla de negocio: no se puede desactivar al último ADMIN activo del
   * sistema, para evitar dejar el negocio sin nadie que lo administre.
   */
  async updateStatus(id: number, dto: UpdateUserStatusDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    if (dto.isActive === false && user.role === Role.ADMIN) {
      const otherActiveAdmins = await this.prisma.user.count({
        where: { role: Role.ADMIN, isActive: true, id: { not: id } },
      });

      if (otherActiveAdmins === 0) {
        throw new ConflictException(
          'No se puede desactivar al último administrador activo del sistema',
        );
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: dto.isActive },
      select: USER_SAFE_SELECT,
    });
  }
}
