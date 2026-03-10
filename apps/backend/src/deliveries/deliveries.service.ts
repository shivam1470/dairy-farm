import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDeliveryDto) {
    return this.prisma.deliveryLog.create({
      data: {
        ...data,
        deliveryDate: new Date(data.deliveryDate),
      },
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

  async update(id: string, data: UpdateDeliveryDto) {
    return this.prisma.deliveryLog.update({
      where: { id },
      data: {
        ...data,
        ...(data.deliveryDate ? { deliveryDate: new Date(data.deliveryDate) } : {}),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.deliveryLog.delete({ where: { id } });
  }
}
