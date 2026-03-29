import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

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
    });
  }

  async findAll(user: any) {
    const farmId = this.requireFarmId(user);
    return this.prisma.task.findMany({
      where: { farmId },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(user: any, id: string) {
    const farmId = this.requireFarmId(user);
    const task = await this.prisma.task.findFirst({ where: { id, farmId } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(user: any, id: string, data: any) {
    await this.findOne(user, id);
    const farmId = this.requireFarmId(user);
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
}
