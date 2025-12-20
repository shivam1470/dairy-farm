import { apiClient } from '@/lib/api';
import { Animal, CreateAnimalDto } from '@dairy-farm/types';

export const animalsApi = {
  // Get all animals for a farm
  getAll: async (farmId: string): Promise<Animal[]> => {
    const response = await apiClient.get(`/animals?farmId=${farmId}`);
    return response.data;
  },

  // Get a single animal by ID
  getById: async (id: string): Promise<Animal> => {
    const response = await apiClient.get(`/animals/${id}`);
    return response.data;
  },

  // Create a new animal
  create: async (data: CreateAnimalDto): Promise<Animal> => {
    const response = await apiClient.post('/animals', data);
    return response.data;
  },

  // Update an existing animal
  update: async (id: string, data: Partial<CreateAnimalDto>): Promise<Animal> => {
    const response = await apiClient.patch(`/animals/${id}`, data);
    return response.data;
  },

  // Delete an animal
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/animals/${id}`);
  },
};