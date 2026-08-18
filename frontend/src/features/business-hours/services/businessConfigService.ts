import { httpClient } from '@/core/api/httpClient';
import { endpoints } from '@/core/api/endpoints';
import type { BusinessConfig } from '@/shared/types';

export interface UpdateBusinessConfigPayload {
  businessName?: string;
  whatsappNumber?: string;
  address?: string;
  deliveryFee?: number;
  isOpen?: boolean;
  openingTime?: string | null;
  closingTime?: string | null;
}

export const businessConfigService = {
  async get(): Promise<BusinessConfig> {
    const { data } = await httpClient.get<BusinessConfig>(
      endpoints.businessConfig.get,
    );
    return data;
  },

  async update(payload: UpdateBusinessConfigPayload): Promise<BusinessConfig> {
    const { data } = await httpClient.put<BusinessConfig>(
      endpoints.businessConfig.get,
      payload,
    );
    return data;
  },
};
