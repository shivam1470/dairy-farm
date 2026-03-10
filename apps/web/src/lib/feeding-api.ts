import { apiClient } from '@/lib/api';
import { FeedingLog, CreateFeedingLogDto } from '@dairy-farm/types';

export const feedingApi = {
  list: async (animalId?: string): Promise<FeedingLog[]> => {
    const qs = animalId ? `?animalId=${animalId}` : '';
    const res = await apiClient.get(`/feeding${qs}`);
    return res.data;
  },

  create: async (data: CreateFeedingLogDto): Promise<FeedingLog> => {
    const res = await apiClient.post('/feeding', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateFeedingLogDto>): Promise<FeedingLog> => {
    const res = await apiClient.patch(`/feeding/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/feeding/${id}`);
  },
};
