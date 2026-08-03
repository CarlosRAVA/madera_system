import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Uso: @Roles(Role.ADMIN)  o  @Roles(Role.ADMIN, Role.CUSTOMER)
 * Se coloca junto a @UseGuards(JwtAuthGuard, RolesGuard) en el controller.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
