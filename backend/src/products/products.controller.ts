import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /api/products — catálogo público (solo productos activos)
   * RF1: Visualización de productos / RF5: Visualización de disponibilidad
   */
  @Get()
  @ApiOperation({ summary: 'Listar catálogo de productos activos (público)' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de productos disponibles' })
  findAllPublic(@Query('categoryId') categoryId?: string) {
    return this.productsService.findAllPublic(
      categoryId ? Number(categoryId) : undefined,
    );
  }

  /**
   * GET /api/products/admin/all — panel de administración (solo ADMIN)
   * Incluye productos activos e inactivos.
   */
  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar todos los productos, incluidos inactivos (solo ADMIN)',
  })
  @ApiResponse({ status: 200, description: 'Lista completa de productos' })
  findAllAdmin() {
    return this.productsService.findAllAdmin();
  }

  /**
   * GET /api/products/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  /**
   * POST /api/products — crea un producto (solo ADMIN)
   */
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear producto (solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  @ApiResponse({ status: 400, description: 'Categoría inexistente' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  /**
   * PUT /api/products/:id — actualiza un producto (solo ADMIN)
   * Incluye activar/desactivar disponibilidad y actualizar stock.
   */
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar producto (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  /**
   * DELETE /api/products/:id — elimina un producto (solo ADMIN)
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar producto (solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar: tiene pedidos asociados',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
