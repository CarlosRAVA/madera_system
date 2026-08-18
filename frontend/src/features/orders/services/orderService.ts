import { httpClient } from '@/core/api/httpClient';
import { endpoints } from '@/core/api/endpoints';
import type { CreateOrderResponse, Order, OrderStatus } from '@/shared/types';

export interface CreateOrderItemPayload {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  observations?: string;
  items: CreateOrderItemPayload[];
}

export const orderService = {
  async create(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await httpClient.post<CreateOrderResponse>(
      endpoints.orders.create,
      payload,
    );
    return data;
  },

  async listMine(): Promise<Order[]> {
    const { data } = await httpClient.get<Order[]>(endpoints.orders.mine);
    return data;
  },

  async listAll(): Promise<Order[]> {
    const { data } = await httpClient.get<Order[]>(endpoints.orders.all);
    return data;
  },

  async getById(id: number): Promise<Order> {
    const { data } = await httpClient.get<Order>(endpoints.orders.detail(id));
    return data;
  },

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const { data } = await httpClient.patch<Order>(
      endpoints.orders.updateStatus(id),
      { status },
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(endpoints.orders.detail(id));
  },
};
