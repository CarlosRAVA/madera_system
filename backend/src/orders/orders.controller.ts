import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

interface AuthenticatedRequest {
  user: { id: number; email: string; role: string };
}

@ApiTags('orders')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * POST /api/orders — crea un pedido (cualquier usuario autenticado)
   * RF2-RF4: valida stock y horario, descuenta inventario y genera el
   * mensaje + enlace de WhatsApp para que el FrontEnd redirija al cliente.
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido creado; incluye whatsappUrl para redirigir al cliente',
  })
  @ApiResponse({
    status: 409,
    description: 'Stock insuficiente o negocio cerrado',
  })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  /**
   * GET /api/orders/mine — pedidos del usuario autenticado ("Mis Pedidos")
   */
  @Get('mine')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar mis pedidos' })
  findMine(@Req() req: AuthenticatedRequest) {
    return this.ordersService.findMine(req.user.id);
  }

  /**
   * GET /api/orders — panel de administración (solo ADMIN)
   */
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los pedidos (solo ADMIN)' })
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  /**
   * GET /api/orders/:id — detalle de un pedido (dueño o ADMIN)
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un pedido por id (dueño o ADMIN)' })
  @ApiResponse({ status: 403, description: 'No tienes acceso a este pedido' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.findOne(id, req.user);
  }

  /**
   * PATCH /api/orders/:id/status — actualiza el estado (solo ADMIN)
   */
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de un pedido (solo ADMIN)' })
  @ApiResponse({
    status: 409,
    description: 'El pedido ya está en un estado final y no puede modificarse',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  /**
   * DELETE /api/orders/:id — elimina un pedido (solo ADMIN)
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un pedido (solo ADMIN)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
