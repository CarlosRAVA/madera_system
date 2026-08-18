import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessConfigService } from '../business-config/business-config.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

interface RequesterInfo {
  id: number;
  role: string;
}

const ORDER_INCLUDE = {
  items: {
    include: { product: { select: { id: true, name: true } } },
  },
} as const;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessConfigService: BusinessConfigService,
  ) {}

  /**
   * POST /api/orders — crea un pedido (RF2-RF4).
   * 1) Verifica que el negocio esté abierto (isOpenNow de BusinessConfig),
   *    evitando pedidos que no se puedan surtir el mismo día.
   * 2) Valida existencia, disponibilidad y stock de cada producto.
   * 3) Descuenta el stock de forma segura ante condiciones de carrera
   *    (updateMany con filtro de stock suficiente dentro de una transacción).
   * 4) Calcula subtotal/total con el precio ACTUAL del producto en BD,
   *    nunca con un precio enviado por el cliente (evita manipulación de
   *    precios desde el FrontEnd).
   * 5) Genera el mensaje y el enlace de WhatsApp (wa.me) para que el
   *    FrontEnd redirija al cliente con el pedido ya redactado.
   */
  async create(userId: number, dto: CreateOrderDto) {
    const businessConfig = await this.businessConfigService.getConfig();

    if (!businessConfig.isOpenNow) {
      throw new ConflictException(
        'El negocio está cerrado en este momento, no es posible generar pedidos.',
      );
    }

    const productIds = [...new Set(dto.items.map((item) => item.productId))];

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    for (const item of dto.items) {
      const product = productMap.get(item.productId);

      if (!product || !product.isActive) {
        throw new BadRequestException(
          `El producto con id ${item.productId} no está disponible`,
        );
      }

      if (product.stock < item.quantity) {
        throw new ConflictException(
          `Stock insuficiente para "${product.name}" (disponible: ${product.stock})`,
        );
      }
    }

    const orderNumber = this.generateOrderNumber();

    const createdOrder = await this.prisma.$transaction(async (tx) => {
      // Descuento de stock a prueba de condiciones de carrera: solo decrementa
      // si sigue habiendo suficiente stock en el momento exacto de la escritura.
      for (const item of dto.items) {
        const result = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (result.count === 0) {
          throw new ConflictException(
            `Stock insuficiente para el producto id ${item.productId} (alguien más lo compró primero)`,
          );
        }
      }

      const itemsData = dto.items.map((item) => {
        const product = productMap.get(item.productId)!;
        const unitPrice = Number(product.price);
        const subtotal = Number((unitPrice * item.quantity).toFixed(2));
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        };
      });

      const subtotal = Number(
        itemsData.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
      );
      const deliveryFee = Number(businessConfig.deliveryFee);
      const total = Number((subtotal + deliveryFee).toFixed(2));

      return tx.order.create({
        data: {
          userId,
          orderNumber,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          deliveryAddress: dto.deliveryAddress,
          observations: dto.observations,
          subtotal,
          deliveryFee,
          total,
          items: { create: itemsData },
        },
        include: ORDER_INCLUDE,
      });
    });

    const { message, whatsappUrl } = this.buildWhatsAppMessage(
      createdOrder,
      businessConfig.whatsappNumber,
    );

    return {
      order: createdOrder,
      whatsappMessage: message,
      whatsappUrl,
    };
  }

  /**
   * GET /api/orders — panel de administración (solo ADMIN)
   */
  async findAllAdmin() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: ORDER_INCLUDE,
    });
  }

  /**
   * GET /api/orders/mine — pedidos del usuario autenticado
   */
  async findMine(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: ORDER_INCLUDE,
    });
  }

  /**
   * GET /api/orders/:id — detalle de un pedido.
   * Solo el dueño del pedido o un ADMIN pueden consultarlo (evita
   * fallas de tipo BOLA: acceder a datos de otro usuario cambiando el id).
   */
  async findOne(id: number, requester: RequesterInfo) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });

    if (!order) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    if (requester.role !== 'ADMIN' && order.userId !== requester.id) {
      throw new ForbiddenException('No tienes acceso a este pedido');
    }

    return order;
  }

  /**
   * PATCH /api/orders/:id/status — actualiza el estado (solo ADMIN).
   * DELIVERED y CANCELLED son estados finales: una vez ahí, el pedido ya
   * no puede modificarse. Cancelar un pedido restituye el stock reservado.
   */
  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new ConflictException(
        `El pedido ya está en un estado final (${order.status}) y no puede modificarse`,
      );
    }

    if (dto.status === OrderStatus.CANCELLED) {
      return this.prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        return tx.order.update({
          where: { id },
          data: { status: OrderStatus.CANCELLED },
          include: ORDER_INCLUDE,
        });
      });
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: ORDER_INCLUDE,
    });
  }

  /**
   * DELETE /api/orders/:id — elimina un pedido (solo ADMIN).
   * Si el pedido no había sido cancelado ni entregado, su stock seguía
   * "reservado"; al eliminarlo se restituye para no perder inventario.
   */
  async remove(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    await this.prisma.$transaction(async (tx) => {
      const shouldRestoreStock =
        order.status !== OrderStatus.CANCELLED &&
        order.status !== OrderStatus.DELIVERED;

      if (shouldRestoreStock) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.order.delete({ where: { id } });
    });

    return { message: `Pedido "${order.orderNumber}" eliminado correctamente` };
  }

  /**
   * Genera un número de pedido legible y prácticamente único:
   * LR-YYYYMMDD-XXXX (fecha + sufijo aleatorio en base36).
   */
  private generateOrderNumber(): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `LR-${datePart}-${randomPart}`;
  }

  /**
   * RF3/RF4 — Genera el mensaje automático del pedido y el enlace de
   * WhatsApp Click-to-Chat (wa.me) al que el botón "COMPRAR" del FrontEnd
   * debe redirigir.
   */
  private buildWhatsAppMessage(
    order: {
      orderNumber: string;
      customerName: string;
      customerPhone: string;
      deliveryAddress: string;
      observations: string | null;
      subtotal: unknown;
      deliveryFee: unknown;
      total: unknown;
      items: {
        quantity: number;
        subtotal: unknown;
        product: { name: string };
      }[];
    },
    whatsappNumber: string,
  ): { message: string; whatsappUrl: string } {
    const lines = [
      `¡Hola! Nuevo pedido *#${order.orderNumber}* de Leños Rellenos 🌭`,
      '',
      `Cliente: ${order.customerName}`,
      `Teléfono: ${order.customerPhone}`,
      `Dirección: ${order.deliveryAddress}`,
      '',
      'Productos:',
      ...order.items.map(
        (item) =>
          `- ${item.quantity}x ${item.product.name} — $${Number(item.subtotal).toFixed(2)}`,
      ),
      '',
      `Subtotal: $${Number(order.subtotal).toFixed(2)}`,
      `Envío: $${Number(order.deliveryFee).toFixed(2)}`,
      `Total: $${Number(order.total).toFixed(2)}`,
    ];

    if (order.observations) {
      lines.push('', `Observaciones: ${order.observations}`);
    }

    const message = lines.join('\n');
    const digitsOnly = whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;

    return { message, whatsappUrl };
  }
}
