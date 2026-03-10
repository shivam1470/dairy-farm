import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const dueDate = (data as any).dueDate ? new Date((data as any).dueDate) : undefined;
    return this.prisma.task.create({
      data: {
        ...data,
        ...(dueDate ? { dueDate } : {}),
      },
    });
  }

  async findAll(farmId: string) {
    return this.prisma.task.findMany({
      where: { farmId },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    const dueDate = (data as any).dueDate ? new Date((data as any).dueDate) : undefined;
    return this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        ...(dueDate ? { dueDate } : {}),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
