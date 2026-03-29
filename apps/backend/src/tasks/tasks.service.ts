import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private readonly taskInclude = {
    assignedTo: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  } as const;

  async create(user: any, data: any) {
    const farmId = this.requireFarmId(user);
    if ((data as any).assignedToId) {
      await this.ensureUserAccess(farmId, (data as any).assignedToId);
    }
    const dueDate = (data as any).dueDate ? new Date((data as any).dueDate) : undefined;
    return this.prisma.task.create({
      data: {
        ...data,
        farmId,
        createdById: user.id,
        ...(dueDate ? { dueDate } : {}),
      },
      include: this.taskInclude,
    });
  }

  async findAll(user: any) {
    const farmId = this.requireFarmId(user);
    return this.prisma.task.findMany({
      where: { farmId },
      orderBy: { dueDate: 'asc' },
      include: this.taskInclude,
    });
  }

  async findOne(user: any, id: string) {
    const farmId = this.requireFarmId(user);
    const task = await this.prisma.task.findFirst({
      where: { id, farmId },
      include: this.taskInclude,
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(user: any, id: string, data: any) {
    const existingTask = await this.findOne(user, id);
    const farmId = this.requireFarmId(user);

    this.assertTaskUpdateAllowed(user, existingTask, data);

    if ((data as any).assignedToId) {
      await this.ensureUserAccess(farmId, (data as any).assignedToId);
    }
    const { farmId: _farmId, createdById: _createdById, ...safeData } = data;
    const dueDate = (data as any).dueDate ? new Date((data as any).dueDate) : undefined;
    return this.prisma.task.update({
      where: { id },
      data: {
        ...safeData,
        ...(dueDate ? { dueDate } : {}),
      },
      include: this.taskInclude,
    });
  }

  async remove(user: any, id: string) {
    await this.findOne(user, id);
    return this.prisma.task.delete({ where: { id } });
  }

  private requireFarmId(user: any) {
    if (!user?.farmId) throw new ForbiddenException('User is not assigned to a farm');
    return user.farmId as string;
  }

  private async ensureUserAccess(farmId: string, userId: string) {
    const farmUser = await this.prisma.user.findFirst({
      where: { id: userId, farmId },
      select: { id: true },
    });

    if (!farmUser) throw new NotFoundException('Assigned user not found');
  }

  private assertTaskUpdateAllowed(user: any, task: any, data: any) {
    const role = user?.role as UserRole | undefined;

    if (role === UserRole.ADMIN || role === UserRole.MANAGER) {
      return;
    }

    if (role !== UserRole.WORKER) {
      throw new ForbiddenException('You do not have access to update tasks');
    }

    if (task.assignedToId !== user.id) {
      throw new ForbiddenException('Workers can only update tasks assigned to them');
    }

    const allowedKeys = new Set(['status', 'notes']);
    const updateKeys = Object.keys(data ?? {}).filter(
      (key) => (data as any)[key] !== undefined,
    );

    const hasForbiddenField = updateKeys.some((key) => !allowedKeys.has(key));

    if (hasForbiddenField) {
      throw new ForbiddenException(
        'Workers can only update task status or notes',
      );
    }

    if (data.status && !this.isWorkerAllowedStatus(data.status)) {
      throw new ForbiddenException('Workers can only set valid task progress states');
    }
  }

  private isWorkerAllowedStatus(status: TaskStatus) {
    const allowedStatuses: TaskStatus[] = [
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
    ];

    return allowedStatuses.includes(status);
  }
}
