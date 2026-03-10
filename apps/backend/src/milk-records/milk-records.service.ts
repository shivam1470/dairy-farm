import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MilkRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Ensure `date` is a Date object for Prisma DateTime.
    // Frontends commonly send YYYY-MM-DD or ISO strings.
    const normalized = {
      ...data,
      date: data?.date ? new Date(data.date) : data?.date,
    };

    return this.prisma.milkRecord.create({
      data: normalized,
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
    const normalized = {
      ...data,
      ...(data?.date ? { date: new Date(data.date) } : {}),
    };
    return this.prisma.milkRecord.update({ where: { id }, data: normalized });
  }

  async remove(id: string) {
    return this.prisma.milkRecord.delete({ where: { id } });
  }
}
