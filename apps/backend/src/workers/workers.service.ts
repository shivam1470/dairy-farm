import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const joinDate = (data as any).joinDate ? new Date((data as any).joinDate) : undefined;
    return this.prisma.worker.create({
      data: {
        ...data,
        ...(joinDate ? { joinDate } : {}),
      },
    });
  }

  async findAll(farmId: string) {
    return this.prisma.worker.findMany({ where: { farmId } });
  }

  async findOne(id: string) {
    return this.prisma.worker.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    const joinDate = (data as any).joinDate ? new Date((data as any).joinDate) : undefined;
    return this.prisma.worker.update({
      where: { id },
      data: {
        ...data,
        ...(joinDate ? { joinDate } : {}),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.worker.delete({ where: { id } });
  }
}
