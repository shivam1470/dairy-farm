import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, data: any) {
    const farmId = this.requireFarmId(user);
    const joinDate = (data as any).joinDate ? new Date((data as any).joinDate) : undefined;
    return this.prisma.worker.create({
      data: {
        ...data,
        farmId,
        ...(joinDate ? { joinDate } : {}),
      },
    });
  }

  async findAll(user: any) {
    const farmId = this.requireFarmId(user);
    return this.prisma.worker.findMany({ where: { farmId } });
  }

  async findOne(user: any, id: string) {
    const farmId = this.requireFarmId(user);
    const worker = await this.prisma.worker.findFirst({ where: { id, farmId } });
    if (!worker) throw new NotFoundException('Worker not found');
    return worker;
  }

  async update(user: any, id: string, data: any) {
    await this.findOne(user, id);
    const { farmId: _farmId, ...safeData } = data;
    const joinDate = (data as any).joinDate ? new Date((data as any).joinDate) : undefined;
    return this.prisma.worker.update({
      where: { id },
      data: {
        ...safeData,
        ...(joinDate ? { joinDate } : {}),
      },
    });
  }

  async remove(user: any, id: string) {
    await this.findOne(user, id);
    return this.prisma.worker.delete({ where: { id } });
  }

  private requireFarmId(user: any) {
    if (!user?.farmId) throw new ForbiddenException('User is not assigned to a farm');
    return user.farmId as string;
  }
}
