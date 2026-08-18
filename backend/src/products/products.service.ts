import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /api/products — catálogo público (RF1, RF5)
   * Solo retorna productos activos (isActive = true) para que los
   * productos deshabilitados por el administrador no sean visibles
   * al cliente (requerimiento de Gestión de Inventario del caso).
   * El campo "stock" viaja siempre en la respuesta para que el
   * FrontEnd pueda mostrar el badge Disponible/Agotado (RF5).
   */
  async findAllPublic(categoryId?: number) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        ...(categoryId ? { categoryId } : {}),
      },
      orderBy: { name: 'asc' },
      include: { category: { select: { id: true, name: true } } },
    });
  }

  /**
   * GET /api/products/admin/all — panel de administración (solo ADMIN)
   * Retorna todos los productos, activos e inactivos, para su gestión.
   */
  async findAllAdmin() {
    return this.prisma.product.findMany({
      orderBy: { name: 'asc' },
      include: { category: { select: { id: true, name: true } } },
    });
  }

  /**
   * GET /api/products/:id
   */
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    return product;
  }

  /**
   * POST /api/products — crea un producto (solo ADMIN)
   * Valida que la categoría exista antes de crear el producto.
   */
  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException(
        `La categoría con id ${dto.categoryId} no existe`,
      );
    }

    return this.prisma.product.create({
      data: {
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        stock: dto.stock,
        isActive: true,
      },
      include: { category: { select: { id: true, name: true } } },
    });
  }

  /**
   * PUT /api/products/:id — actualiza un producto (solo ADMIN)
   * Permite modificar cualquier campo, incluyendo activar/desactivar
   * (isActive) y actualizar el stock disponible (Gestión de Inventario).
   */
  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new BadRequestException(
          `La categoría con id ${dto.categoryId} no existe`,
        );
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: { select: { id: true, name: true } } },
    });
  }

  /**
   * DELETE /api/products/:id — elimina un producto (solo ADMIN)
   * No se puede eliminar si tiene pedidos asociados → 409 Conflict.
   * Se recomienda desactivar (isActive = false) en vez de eliminar
   * cuando el producto ya tiene historial de ventas.
   */
  async remove(id: number) {
    const product = await this.findOne(id);

    const orderItemsCount = await this.prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      throw new ConflictException(
        `No se puede eliminar "${product.name}" porque tiene pedidos asociados. Desactívalo en su lugar.`,
      );
    }

    await this.prisma.product.delete({ where: { id } });

    return { message: `Producto "${product.name}" eliminado correctamente` };
  }
}
