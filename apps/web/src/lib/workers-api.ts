import { apiClient } from '@/lib/api';
import { Worker, CreateWorkerDto } from '@dairy-farm/types';

export const workersApi = {
  list: async (farmId: string): Promise<Worker[]> => {
    const res = await apiClient.get(`/workers?farmId=${farmId}`);
    return res.data;
  },

  create: async (data: CreateWorkerDto): Promise<Worker> => {
    const res = await apiClient.post('/workers', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateWorkerDto>): Promise<Worker> => {
    const res = await apiClient.patch(`/workers/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/workers/${id}`);
  },
};
