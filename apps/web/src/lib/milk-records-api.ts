import { apiClient } from '@/lib/api';

export type MilkSession = 'MORNING' | 'EVENING';
export type MilkQuality = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';

export type MilkRecord = {
  id: string;
  farmId: string;
  animalId: string;
  date: string;
  session: MilkSession;
  quantity: number;
  fatContent?: number | null;
  quality?: MilkQuality | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  animal?: {
    id: string;
    tagNumber: string;
    name?: string | null;
    breed: string;
  };
};

export type CreateMilkRecordDto = {
  animalId: string;
  farmId: string;
  date: string;
  session: MilkSession;
  quantity: number;
  fatContent?: number;
  quality?: MilkQuality;
  notes?: string;
};

export const milkRecordsApi = {
  getAll: async (farmId: string, animalId?: string): Promise<MilkRecord[]> => {
    const params = new URLSearchParams();
    // backend currently filters only by animalId; farmId is included for future use.
    if (animalId) params.set('animalId', animalId);
    const query = params.toString();

    const response = await apiClient.get(`/milk-records${query ? `?${query}` : ''}`);
    // Best-effort filter client side by farmId (until backend supports farmId query)
    const records: MilkRecord[] = response.data;
    return records.filter(r => r.farmId === farmId);
  },

  create: async (data: CreateMilkRecordDto): Promise<MilkRecord> => {
    const response = await apiClient.post('/milk-records', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/milk-records/${id}`);
  },
};
