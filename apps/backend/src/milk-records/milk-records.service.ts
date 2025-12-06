import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MilkRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.milkRecord.create({
      data,
    });
  }

  async findAll(animalId?: string) {
    return this.prisma.milkRecord.findMany({
      where: animalId ? { animalId } : {},
      include: { animal: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.milkRecord.findUnique({
      where: { id },
      include: { animal: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.milkRecord.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.milkRecord.delete({ where: { id } });
  }
}
