import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.deliveryLog.create({
      data,
    });
  }

  async findAll(farmId: string) {
    return this.prisma.deliveryLog.findMany({
      where: { farmId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.deliveryLog.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.deliveryLog.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.deliveryLog.delete({ where: { id } });
  }
}
