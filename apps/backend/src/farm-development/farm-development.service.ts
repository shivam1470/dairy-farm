import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import {
  DevelopmentStatus,
  MilestoneStatus,
  FarmDevelopmentStatus,
} from '@prisma/client';

@Injectable()
export class FarmDevelopmentService {
  constructor(private prisma: PrismaService) {}

  // Phase CRUD Operations
  async createPhase(data: CreatePhaseDto) {
    // Validate that the farm exists
    const farm = await this.prisma.farm.findUnique({
      where: { id: data.farmId },
    });

    if (!farm) {
      throw new NotFoundException(`Farm with ID ${data.farmId} not found`);
    }

    const phase = await this.prisma.farmDevelopmentPhase.create({
      data: {
        farmId: data.farmId,
        phaseName: data.phaseName,
        description: data.description,
        phaseOrder: data.phaseOrder ?? 0,
        status: data.status ?? DevelopmentStatus.NOT_STARTED,
        progress: data.progress ?? 0,
        budget: data.budget,
        startDate: data.startDate ? new Date(data.startDate) : null,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        notes: data.notes,
      },
      include: {
        milestones: true,
      },
    });

    return phase;
  }

  async getPhasesByFarm(farmId: string) {
    return this.prisma.farmDevelopmentPhase.findMany({
      where: { farmId },
      include: {
        milestones: {
          orderBy: { milestoneOrder: 'asc' },
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { phaseOrder: 'asc' },
    });
  }

  async getPhaseById(id: string) {
    const phase = await this.prisma.farmDevelopmentPhase.findUnique({
      where: { id },
      include: {
        milestones: {
          orderBy: { milestoneOrder: 'asc' },
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!phase) {
      throw new NotFoundException(`Phase with ID ${id} not found`);
    }

    return phase;
  }

  async updatePhase(id: string, data: UpdatePhaseDto) {
    const phase = await this.getPhaseById(id);

    const updateData: any = {};
    if (data.phaseName !== undefined) updateData.phaseName = data.phaseName;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.phaseOrder !== undefined) updateData.phaseOrder = data.phaseOrder;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.budget !== undefined) updateData.budget = data.budget;
    if (data.actualCost !== undefined) updateData.actualCost = data.actualCost;
    if (data.startDate !== undefined)
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.targetDate !== undefined)
      updateData.targetDate = data.targetDate ? new Date(data.targetDate) : null;
    if (data.completedDate !== undefined)
      updateData.completedDate = data.completedDate
        ? new Date(data.completedDate)
        : null;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const updatedPhase = await this.prisma.farmDevelopmentPhase.update({
      where: { id },
      data: updateData,
      include: {
        milestones: {
          orderBy: { milestoneOrder: 'asc' },
        },
      },
    });

    // Auto-update phase status based on milestones
    await this.updatePhaseStatus(id);

    return updatedPhase;
  }

  async deletePhase(id: string) {
    await this.getPhaseById(id);
    await this.prisma.farmDevelopmentPhase.delete({
      where: { id },
    });
    return { success: true };
  }

  // Milestone CRUD Operations
  async createMilestone(phaseId: string, data: CreateMilestoneDto) {
    const phase = await this.getPhaseById(phaseId);

    const milestone = await this.prisma.developmentMilestone.create({
      data: {
        phaseId,
        title: data.title,
        description: data.description,
        milestoneOrder: data.milestoneOrder ?? 0,
        status: data.status ?? MilestoneStatus.PENDING,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assignedToId: data.assignedToId,
        notes: data.notes,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Auto-update phase status and progress
    await this.updatePhaseStatus(phaseId);

    return milestone;
  }

  async getMilestonesByPhase(phaseId: string) {
    await this.getPhaseById(phaseId);
    return this.prisma.developmentMilestone.findMany({
      where: { phaseId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { milestoneOrder: 'asc' },
    });
  }

  async getMilestoneById(id: string) {
    const milestone = await this.prisma.developmentMilestone.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        phase: true,
      },
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }

    return milestone;
  }

  async updateMilestone(id: string, data: UpdateMilestoneDto) {
    const milestone = await this.getMilestoneById(id);

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.milestoneOrder !== undefined)
      updateData.milestoneOrder = data.milestoneOrder;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.dueDate !== undefined)
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.completedDate !== undefined)
      updateData.completedDate = data.completedDate
        ? new Date(data.completedDate)
        : null;
    if (data.assignedToId !== undefined)
      updateData.assignedToId = data.assignedToId;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const updatedMilestone = await this.prisma.developmentMilestone.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Auto-update phase status and progress
    await this.updatePhaseStatus(milestone.phaseId);

    return updatedMilestone;
  }

  async deleteMilestone(id: string) {
    const milestone = await this.getMilestoneById(id);
    await this.prisma.developmentMilestone.delete({
      where: { id },
    });

    // Auto-update phase status and progress
    await this.updatePhaseStatus(milestone.phaseId);

    return { success: true };
  }

  async completeMilestone(id: string) {
    const milestone = await this.getMilestoneById(id);

    const updatedMilestone = await this.prisma.developmentMilestone.update({
      where: { id },
      data: {
        status: MilestoneStatus.COMPLETED,
        completedDate: new Date(),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Auto-update phase status and progress
    await this.updatePhaseStatus(milestone.phaseId);

    return updatedMilestone;
  }

  // Progress Calculation
  async calculatePhaseProgress(phaseId: string): Promise<number> {
    const phase = await this.getPhaseById(phaseId);
    const milestones = phase.milestones;

    if (milestones.length === 0) {
      return 0;
    }

    const completedCount = milestones.filter(
      (m) => m.status === MilestoneStatus.COMPLETED,
    ).length;

    return Math.round((completedCount / milestones.length) * 100);
  }

  async calculateFarmProgress(farmId: string): Promise<number> {
    const phases = await this.getPhasesByFarm(farmId);

    if (phases.length === 0) {
      return 0;
    }

    const totalProgress = phases.reduce((sum, phase) => {
      return sum + phase.progress;
    }, 0);

    return Math.round(totalProgress / phases.length);
  }

  async getProgressStats(farmId: string) {
    const phases = await this.getPhasesByFarm(farmId);
    const farm = await this.prisma.farm.findUnique({
      where: { id: farmId },
    });

    const overallProgress = await this.calculateFarmProgress(farmId);

    const budgetSummary = {
      totalBudget: phases.reduce((sum, p) => sum + (p.budget || 0), 0),
      spent: phases.reduce((sum, p) => sum + (p.actualCost || 0), 0),
      remaining: 0,
    };
    budgetSummary.remaining =
      budgetSummary.totalBudget - budgetSummary.spent;

    const phaseProgress = phases.map((phase) => ({
      id: phase.id,
      phaseName: phase.phaseName,
      progress: phase.progress,
      status: phase.status,
      budget: phase.budget || 0,
      actualCost: phase.actualCost || 0,
      milestoneCount: phase.milestones.length,
      completedMilestones: phase.milestones.filter(
        (m) => m.status === MilestoneStatus.COMPLETED,
      ).length,
    }));

    const currentPhase = phases.find(
      (p) => p.status === DevelopmentStatus.IN_PROGRESS,
    );

    return {
      overallProgress,
      currentPhase: currentPhase?.phaseName || null,
      farmStatus: farm?.developmentStatus || FarmDevelopmentStatus.PLANNING,
      estimatedCompletionDate: farm?.estimatedCompletionDate || null,
      phases: phaseProgress,
      budgetSummary,
    };
  }

  // Auto-update methods
  async updatePhaseStatus(phaseId: string) {
    const phase = await this.getPhaseById(phaseId);
    const milestones = phase.milestones;

    // Calculate progress
    const progress = await this.calculatePhaseProgress(phaseId);

    // Determine status based on milestones
    let newStatus = phase.status;

    if (milestones.length === 0) {
      newStatus = DevelopmentStatus.NOT_STARTED;
    } else {
      const completedCount = milestones.filter(
        (m) => m.status === MilestoneStatus.COMPLETED,
      ).length;
      const inProgressCount = milestones.filter(
        (m) => m.status === MilestoneStatus.IN_PROGRESS,
      ).length;

      if (completedCount === milestones.length) {
        newStatus = DevelopmentStatus.COMPLETED;
      } else if (completedCount > 0 || inProgressCount > 0) {
        newStatus = DevelopmentStatus.IN_PROGRESS;
      } else {
        newStatus = DevelopmentStatus.NOT_STARTED;
      }
    }

    // Update phase
    await this.prisma.farmDevelopmentPhase.update({
      where: { id: phaseId },
      data: {
        progress,
        status: newStatus,
        completedDate:
          newStatus === DevelopmentStatus.COMPLETED
            ? new Date()
            : phase.completedDate,
      },
    });

    // Update farm status if needed
    const farm = await this.prisma.farm.findUnique({
      where: { id: phase.farmId },
      include: {
        developmentPhases: true,
      },
    });

    if (farm) {
      await this.updateFarmStatus(farm.id);
    }
  }

  async updateFarmStatus(farmId: string) {
    const phases = await this.getPhasesByFarm(farmId);

    if (phases.length === 0) {
      return;
    }

    // Determine farm status based on phase completion
    const allCompleted = phases.every(
      (p) => p.status === DevelopmentStatus.COMPLETED,
    );
    const anyInProgress = phases.some(
      (p) => p.status === DevelopmentStatus.IN_PROGRESS,
    );

    let newFarmStatus: FarmDevelopmentStatus;

    if (allCompleted) {
      newFarmStatus = FarmDevelopmentStatus.OPERATIONAL;
    } else if (anyInProgress) {
      // Find the first incomplete phase
      const incompletePhase = phases.find(
        (p) => p.status !== DevelopmentStatus.COMPLETED,
      );
      // Map phase name to farm status (simplified logic)
      if (incompletePhase?.phaseName.toLowerCase().includes('land')) {
        newFarmStatus = FarmDevelopmentStatus.LAND_ACQUISITION;
      } else if (
        incompletePhase?.phaseName.toLowerCase().includes('infrastructure')
      ) {
        newFarmStatus = FarmDevelopmentStatus.INFRASTRUCTURE;
      } else if (incompletePhase?.phaseName.toLowerCase().includes('equipment')) {
        newFarmStatus = FarmDevelopmentStatus.EQUIPMENT_SETUP;
      } else if (incompletePhase?.phaseName.toLowerCase().includes('animal')) {
        newFarmStatus = FarmDevelopmentStatus.ANIMAL_ACQUISITION;
      } else {
        newFarmStatus = FarmDevelopmentStatus.INFRASTRUCTURE;
      }
    } else {
      newFarmStatus = FarmDevelopmentStatus.PLANNING;
    }

    await this.prisma.farm.update({
      where: { id: farmId },
      data: {
        developmentStatus: newFarmStatus,
      },
    });
  }
}

