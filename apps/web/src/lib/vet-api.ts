import { apiClient } from '@/lib/api';
import { VetVisit, CreateVetVisitDto } from '@dairy-farm/types';

export const vetApi = {
  list: async (animalId?: string): Promise<VetVisit[]> => {
    const qs = animalId ? `?animalId=${animalId}` : '';
    const res = await apiClient.get(`/vet${qs}`);
    return res.data;
  },

  create: async (data: CreateVetVisitDto): Promise<VetVisit> => {
    const res = await apiClient.post('/vet', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateVetVisitDto>): Promise<VetVisit> => {
    const res = await apiClient.patch(`/vet/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/vet/${id}`);
  },
};
