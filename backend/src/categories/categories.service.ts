import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /api/categories — retorna todas las categorías (público, sin auth)
   */
  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }

  /**
   * GET /api/categories/:id — retorna una categoría por id
   */
  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }

    return category;
  }

  /**
   * POST /api/categories — crea una categoría (solo ADMIN)
   * Valida que el nombre no esté duplicado
   */
  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe una categoría con el nombre "${dto.name}"`,
      );
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        description: dto.description,
        isActive: true,
      },
    });
  }

  /**
   * PUT /api/categories/:id — actualiza una categoría (solo ADMIN)
   * Valida que el nuevo nombre no esté duplicado en otra categoría
   */
  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.category.findUnique({
        where: { name: dto.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Ya existe una categoría con el nombre "${dto.name}"`,
        );
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * DELETE /api/categories/:id — elimina una categoría (solo ADMIN)
   * No se puede eliminar si tiene productos asociados → 409 Conflict
   */
  async remove(id: number) {
    const category = await this.findOne(id);

    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new ConflictException(
        `No se puede eliminar la categoría "${category.name}" porque tiene ${productCount} producto(s) asociado(s)`,
      );
    }

    await this.prisma.category.delete({ where: { id } });

    return { message: `Categoría "${category.name}" eliminada correctamente` };
  }
}
