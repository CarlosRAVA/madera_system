import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

interface AuthenticatedRequest {
  user: { id: number; email: string; role: string };
}

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/users/me — perfil del usuario autenticado
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mi perfil' })
  getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.findMe(req.user.id);
  }

  /**
   * PATCH /api/users/me — actualiza mi perfil
   */
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar mi perfil (nombre, teléfono)' })
  updateMe(@Req() req: AuthenticatedRequest, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMe(req.user.id, dto);
  }

  /**
   * GET /api/users — panel de administración (solo ADMIN)
   */
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuarios (solo ADMIN)' })
  findAllAdmin() {
    return this.usersService.findAllAdmin();
  }

  /**
   * PATCH /api/users/:id/status — activa/desactiva una cuenta (solo ADMIN)
   */
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar/desactivar un usuario (solo ADMIN)' })
  @ApiResponse({
    status: 409,
    description: 'No se puede desactivar al último administrador activo',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, dto);
  }
}
