import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, data: CreateDeliveryDto) {
    const farmId = this.requireFarmId(user);
    return this.prisma.deliveryLog.create({
      data: {
        ...data,
        farmId,
        createdById: user.id,
        deliveryDate: new Date(data.deliveryDate),
      },
    });
  }

  async findAll(user: any) {
    const farmId = this.requireFarmId(user);
    return this.prisma.deliveryLog.findMany({
      where: { farmId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(user: any, id: string) {
    const farmId = this.requireFarmId(user);
    const delivery = await this.prisma.deliveryLog.findFirst({ where: { id, farmId } });
    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async update(user: any, id: string, data: UpdateDeliveryDto) {
    await this.findOne(user, id);
    const { farmId: _farmId, createdById: _createdById, ...safeData } = data as any;
    return this.prisma.deliveryLog.update({
      where: { id },
      data: {
        ...safeData,
        ...(data.deliveryDate ? { deliveryDate: new Date(data.deliveryDate) } : {}),
      },
    });
  }

  async remove(user: any, id: string) {
    await this.findOne(user, id);
    return this.prisma.deliveryLog.delete({ where: { id } });
  }

  private requireFarmId(user: any) {
    if (!user?.farmId) throw new ForbiddenException('User is not assigned to a farm');
    return user.farmId as string;
  }
}
