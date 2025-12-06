import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedingService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.feedingLog.create({ data });
  }

  async findAll(animalId?: string) {
    return this.prisma.feedingLog.findMany({
      where: animalId ? { animalId } : {},
      include: { animal: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.feedingLog.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.feedingLog.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.feedingLog.delete({ where: { id } });
  }
}
