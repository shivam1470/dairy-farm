import apiClient from './api';

export interface FarmDevelopmentPhase {
  id: string;
  farmId: string;
  phaseName: string;
  description?: string;
  phaseOrder: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  progress: number;
  budget?: number;
  actualCost?: number;
  startDate?: string;
  targetDate?: string;
  completedDate?: string;
  notes?: string;
  milestones: DevelopmentMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface DevelopmentMilestone {
  id: string;
  phaseId: string;
  title: string;
  description?: string;
  milestoneOrder: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  dueDate?: string;
  completedDate?: string;
  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhaseDto {
  farmId: string;
  phaseName: string;
  description?: string;
  phaseOrder?: number;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  progress?: number;
  budget?: number;
  startDate?: string;
  targetDate?: string;
  notes?: string;
}

export interface UpdatePhaseDto {
  phaseName?: string;
  description?: string;
  phaseOrder?: number;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  progress?: number;
  budget?: number;
  actualCost?: number;
  startDate?: string;
  targetDate?: string;
  completedDate?: string;
  notes?: string;
}

export interface CreateMilestoneDto {
  title: string;
  description?: string;
  milestoneOrder?: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  dueDate?: string;
  assignedToId?: string;
  notes?: string;
}

export interface UpdateMilestoneDto {
  title?: string;
  description?: string;
  milestoneOrder?: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  dueDate?: string;
  completedDate?: string;
  assignedToId?: string;
  notes?: string;
}

export interface ProgressStats {
  overallProgress: number;
  currentPhase: string | null;
  farmStatus: string;
  estimatedCompletionDate: string | null;
  phases: Array<{
    id: string;
    phaseName: string;
    progress: number;
    status: string;
    budget: number;
    actualCost: number;
    milestoneCount: number;
    completedMilestones: number;
  }>;
  budgetSummary: {
    totalBudget: number;
    spent: number;
    remaining: number;
  };
}

// Phase API
export const getPhases = async (farmId: string): Promise<FarmDevelopmentPhase[]> => {
  const response = await apiClient.get(`/farm-development/phases?farmId=${farmId}`);
  return response.data;
};

export const getPhase = async (id: string): Promise<FarmDevelopmentPhase> => {
  const response = await apiClient.get(`/farm-development/phases/${id}`);
  return response.data;
};

export const createPhase = async (data: CreatePhaseDto): Promise<FarmDevelopmentPhase> => {
  const response = await apiClient.post('/farm-development/phases', data);
  return response.data;
};

export const updatePhase = async (
  id: string,
  data: UpdatePhaseDto,
): Promise<FarmDevelopmentPhase> => {
  const response = await apiClient.patch(`/farm-development/phases/${id}`, data);
  return response.data;
};

export const deletePhase = async (id: string): Promise<void> => {
  await apiClient.delete(`/farm-development/phases/${id}`);
};

// Milestone API
export const getMilestones = async (phaseId: string): Promise<DevelopmentMilestone[]> => {
  const response = await apiClient.get(`/farm-development/phases/${phaseId}/milestones`);
  return response.data;
};

export const getMilestone = async (id: string): Promise<DevelopmentMilestone> => {
  const response = await apiClient.get(`/farm-development/milestones/${id}`);
  return response.data;
};

export const createMilestone = async (
  phaseId: string,
  data: CreateMilestoneDto,
): Promise<DevelopmentMilestone> => {
  const response = await apiClient.post(`/farm-development/phases/${phaseId}/milestones`, data);
  return response.data;
};

export const updateMilestone = async (
  id: string,
  data: UpdateMilestoneDto,
): Promise<DevelopmentMilestone> => {
  const response = await apiClient.patch(`/farm-development/milestones/${id}`, data);
  return response.data;
};

export const completeMilestone = async (id: string): Promise<DevelopmentMilestone> => {
  const response = await apiClient.patch(`/farm-development/milestones/${id}/complete`);
  return response.data;
};

export const deleteMilestone = async (id: string): Promise<void> => {
  await apiClient.delete(`/farm-development/milestones/${id}`);
};

// Progress API
export const getProgressStats = async (farmId: string): Promise<ProgressStats> => {
  const response = await apiClient.get(`/farm-development/progress?farmId=${farmId}`);
  return response.data;
};

