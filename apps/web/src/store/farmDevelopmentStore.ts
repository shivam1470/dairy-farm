import { create } from 'zustand';
import {
  FarmDevelopmentPhase,
  DevelopmentMilestone,
  CreatePhaseDto,
  UpdatePhaseDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  ProgressStats,
  getPhases,
  getPhase,
  createPhase,
  updatePhase,
  deletePhase,
  getMilestones,
  createMilestone,
  updateMilestone,
  completeMilestone,
  deleteMilestone,
  getProgressStats,
} from '@/lib/farm-development-api';

interface FarmDevelopmentState {
  phases: FarmDevelopmentPhase[];
  selectedPhase: FarmDevelopmentPhase | null;
  progressStats: ProgressStats | null;
  loading: boolean;
  error: string | null;

  // Phase actions
  fetchPhases: (farmId: string) => Promise<void>;
  fetchPhase: (id: string) => Promise<void>;
  addPhase: (data: CreatePhaseDto) => Promise<void>;
  updatePhaseData: (id: string, data: UpdatePhaseDto) => Promise<void>;
  removePhase: (id: string) => Promise<void>;
  setSelectedPhase: (phase: FarmDevelopmentPhase | null) => void;

  // Milestone actions
  fetchMilestones: (phaseId: string) => Promise<void>;
  addMilestone: (phaseId: string, data: CreateMilestoneDto) => Promise<void>;
  updateMilestoneData: (id: string, data: UpdateMilestoneDto) => Promise<void>;
  completeMilestoneAction: (id: string) => Promise<void>;
  removeMilestone: (id: string) => Promise<void>;

  // Progress actions
  fetchProgressStats: (farmId: string) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const useFarmDevelopmentStore = create<FarmDevelopmentState>((set, get) => ({
  phases: [],
  selectedPhase: null,
  progressStats: null,
  loading: false,
  error: null,

  fetchPhases: async (farmId: string) => {
    set({ loading: true, error: null });
    try {
      const phases = await getPhases(farmId);
      set({ phases, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch phases',
        loading: false,
      });
    }
  },

  fetchPhase: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const phase = await getPhase(id);
      set({ selectedPhase: phase, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch phase',
        loading: false,
      });
    }
  },

  addPhase: async (data: CreatePhaseDto) => {
    set({ loading: true, error: null });
    try {
      const newPhase = await createPhase(data);
      set((state) => ({
        phases: [...state.phases, newPhase],
        loading: false,
      }));
      // Refresh progress stats
      if (data.farmId) {
        await get().fetchProgressStats(data.farmId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create phase',
        loading: false,
      });
      throw error;
    }
  },

  updatePhaseData: async (id: string, data: UpdatePhaseDto) => {
    set({ loading: true, error: null });
    try {
      const updatedPhase = await updatePhase(id, data);
      set((state) => ({
        phases: state.phases.map((p) => (p.id === id ? updatedPhase : p)),
        selectedPhase:
          state.selectedPhase?.id === id ? updatedPhase : state.selectedPhase,
        loading: false,
      }));
      // Refresh progress stats if farmId available
      const phase = get().phases.find((p) => p.id === id);
      if (phase?.farmId) {
        await get().fetchProgressStats(phase.farmId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update phase',
        loading: false,
      });
      throw error;
    }
  },

  removePhase: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deletePhase(id);
      const phase = get().phases.find((p) => p.id === id);
      set((state) => ({
        phases: state.phases.filter((p) => p.id !== id),
        selectedPhase:
          state.selectedPhase?.id === id ? null : state.selectedPhase,
        loading: false,
      }));
      // Refresh progress stats
      if (phase?.farmId) {
        await get().fetchProgressStats(phase.farmId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete phase',
        loading: false,
      });
      throw error;
    }
  },

  setSelectedPhase: (phase: FarmDevelopmentPhase | null) => {
    set({ selectedPhase: phase });
  },

  fetchMilestones: async (phaseId: string) => {
    set({ loading: true, error: null });
    try {
      const milestones = await getMilestones(phaseId);
      set((state) => ({
        phases: state.phases.map((p) =>
          p.id === phaseId ? { ...p, milestones } : p,
        ),
        selectedPhase: state.selectedPhase?.id === phaseId
          ? { ...state.selectedPhase, milestones }
          : state.selectedPhase,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch milestones',
        loading: false,
      });
    }
  },

  addMilestone: async (phaseId: string, data: CreateMilestoneDto) => {
    set({ loading: true, error: null });
    try {
      const newMilestone = await createMilestone(phaseId, data);
      set((state) => ({
        phases: state.phases.map((p) =>
          p.id === phaseId
            ? { ...p, milestones: [...p.milestones, newMilestone] }
            : p,
        ),
        selectedPhase:
          state.selectedPhase?.id === phaseId
            ? {
                ...state.selectedPhase,
                milestones: [
                  ...state.selectedPhase.milestones,
                  newMilestone,
                ],
              }
            : state.selectedPhase,
        loading: false,
      }));
      // Refresh progress stats
      const phase = get().phases.find((p) => p.id === phaseId);
      if (phase?.farmId) {
        await get().fetchProgressStats(phase.farmId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create milestone',
        loading: false,
      });
      throw error;
    }
  },

  updateMilestoneData: async (id: string, data: UpdateMilestoneDto) => {
    set({ loading: true, error: null });
    try {
      const updatedMilestone = await updateMilestone(id, data);
      set((state) => ({
        phases: state.phases.map((p) => ({
          ...p,
          milestones: p.milestones.map((m) =>
            m.id === id ? updatedMilestone : m,
          ),
        })),
        selectedPhase: state.selectedPhase
          ? {
              ...state.selectedPhase,
              milestones: state.selectedPhase.milestones.map((m) =>
                m.id === id ? updatedMilestone : m,
              ),
            }
          : null,
        loading: false,
      }));
      // Refresh progress stats
      const phase = get().phases.find((p) =>
        p.milestones.some((m) => m.id === id),
      );
      if (phase?.farmId) {
        await get().fetchProgressStats(phase.farmId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update milestone',
        loading: false,
      });
      throw error;
    }
  },

  completeMilestoneAction: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updatedMilestone = await completeMilestone(id);
      set((state) => ({
        phases: state.phases.map((p) => ({
          ...p,
          milestones: p.milestones.map((m) =>
            m.id === id ? updatedMilestone : m,
          ),
        })),
        selectedPhase: state.selectedPhase
          ? {
              ...state.selectedPhase,
              milestones: state.selectedPhase.milestones.map((m) =>
                m.id === id ? updatedMilestone : m,
              ),
            }
          : null,
        loading: false,
      }));
      // Refresh progress stats
      const phase = get().phases.find((p) =>
        p.milestones.some((m) => m.id === id),
      );
      if (phase?.farmId) {
        await get().fetchProgressStats(phase.farmId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to complete milestone',
        loading: false,
      });
      throw error;
    }
  },

  removeMilestone: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const phase = get().phases.find((p) =>
        p.milestones.some((m) => m.id === id),
      );
      await deleteMilestone(id);
      set((state) => ({
        phases: state.phases.map((p) => ({
          ...p,
          milestones: p.milestones.filter((m) => m.id !== id),
        })),
        selectedPhase: state.selectedPhase
          ? {
              ...state.selectedPhase,
              milestones: state.selectedPhase.milestones.filter(
                (m) => m.id !== id,
              ),
            }
          : null,
        loading: false,
      }));
      // Refresh progress stats
      if (phase?.farmId) {
        await get().fetchProgressStats(phase.farmId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete milestone',
        loading: false,
      });
      throw error;
    }
  },

  fetchProgressStats: async (farmId: string) => {
    set({ loading: true, error: null });
    try {
      const stats = await getProgressStats(farmId);
      set({ progressStats: stats, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch progress stats',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

