import { apiClient } from '@/lib/api';
import { DeliveryLog, CreateDeliveryLogDto } from '@dairy-farm/types';

export const deliveriesApi = {
  list: async (farmId: string): Promise<DeliveryLog[]> => {
    const res = await apiClient.get(`/deliveries?farmId=${farmId}`);
    return res.data;
  },

  create: async (data: CreateDeliveryLogDto): Promise<DeliveryLog> => {
    const res = await apiClient.post('/deliveries', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateDeliveryLogDto>): Promise<DeliveryLog> => {
    const res = await apiClient.patch(`/deliveries/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/deliveries/${id}`);
  },
};
