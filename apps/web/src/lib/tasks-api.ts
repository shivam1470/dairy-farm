import { apiClient } from '@/lib/api';
import { Task, CreateTaskDto } from '@dairy-farm/types';

export const tasksApi = {
  list: async (farmId: string): Promise<Task[]> => {
    const res = await apiClient.get(`/tasks?farmId=${farmId}`);
    return res.data;
  },

  create: async (data: CreateTaskDto): Promise<Task> => {
    const res = await apiClient.post('/tasks', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateTaskDto>): Promise<Task> => {
    const res = await apiClient.patch(`/tasks/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
