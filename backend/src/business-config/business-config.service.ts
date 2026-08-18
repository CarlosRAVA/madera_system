import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBusinessConfigDto } from './dto/update-business-config.dto';

const SINGLETON_ID = 1;
const DEFAULT_TIMEZONE = process.env.BUSINESS_TIMEZONE ?? 'America/Mexico_City';

interface OpenScheduleFields {
  isOpen: boolean;
  openingTime: string | null;
  closingTime: string | null;
}

@Injectable()
export class BusinessConfigService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /api/business-config — información pública del negocio (RF6).
   * Si aún no existe el registro singleton (normalmente lo crea el seed),
   * se crea aquí mismo con valores por defecto para evitar un 500.
   */
  async getConfig() {
    let config = await this.prisma.businessConfig.findUnique({
      where: { id: SINGLETON_ID },
    });

    if (!config) {
      config = await this.prisma.businessConfig.create({
        data: {
          id: SINGLETON_ID,
          businessName: 'Leños Rellenos',
          whatsappNumber: process.env.WHATSAPP_NUMBER ?? '+520000000000',
          isOpen: true,
          deliveryFee: 0,
        },
      });
    }

    return {
      ...config,
      isOpenNow: this.computeIsOpenNow(config),
    };
  }

  /**
   * PUT /api/business-config — actualiza la configuración (solo ADMIN).
   * BusinessConfig es un singleton: siempre opera sobre el mismo registro
   * (id=1), creándolo si todavía no existiera.
   */
  async update(dto: UpdateBusinessConfigDto) {
    const updated = await this.prisma.businessConfig.upsert({
      where: { id: SINGLETON_ID },
      update: dto,
      create: {
        id: SINGLETON_ID,
        businessName: dto.businessName ?? 'Leños Rellenos',
        whatsappNumber:
          dto.whatsappNumber ?? process.env.WHATSAPP_NUMBER ?? '+520000000000',
        address: dto.address,
        deliveryFee: dto.deliveryFee ?? 0,
        isOpen: dto.isOpen ?? true,
        openingTime: dto.openingTime,
        closingTime: dto.closingTime,
      },
    });

    return {
      ...updated,
      isOpenNow: this.computeIsOpenNow(updated),
    };
  }

  /**
   * RF6 — Horario del negocio.
   * Regla de negocio:
   *  1. El interruptor manual `isOpen` funciona como override: si el
   *     administrador lo pone en false (ej. vacaciones, día festivo), el
   *     negocio se muestra cerrado sin importar el horario configurado.
   *  2. Si además hay un horario configurado (openingTime y closingTime),
   *     se valida que la hora actual esté dentro de esa ventana, incluyendo
   *     horarios que cruzan la medianoche (ej. 18:00 - 02:00).
   *  3. Si no hay horario configurado, se respeta únicamente el switch manual.
   */
  private computeIsOpenNow(config: OpenScheduleFields): boolean {
    if (!config.isOpen) {
      return false;
    }

    if (!config.openingTime || !config.closingTime) {
      return true;
    }

    const openMinutes = this.parseTimeToMinutes(config.openingTime);
    const closeMinutes = this.parseTimeToMinutes(config.closingTime);

    if (openMinutes === null || closeMinutes === null) {
      return true;
    }

    const nowMinutes = this.getCurrentMinutes();

    if (openMinutes === closeMinutes) {
      return true; // horario 24 horas
    }

    if (openMinutes < closeMinutes) {
      // Rango normal dentro del mismo día, ej. 09:00 - 22:00
      return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
    }

    // Rango que cruza la medianoche, ej. 18:00 - 02:00
    return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
  }

  private getCurrentMinutes(): number {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: DEFAULT_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    let hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
    const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');

    // Algunos motores ICU representan la medianoche como "24" en vez de "00"
    if (hour === 24) {
      hour = 0;
    }

    return hour * 60 + minute;
  }

  private parseTimeToMinutes(time: string): number | null {
    const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time);
    if (!match) {
      return null;
    }
    return Number(match[1]) * 60 + Number(match[2]);
  }
}
