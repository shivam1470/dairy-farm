import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedingLogDto } from './dto/create-feeding-log.dto';
import { UpdateFeedingLogDto } from './dto/update-feeding-log.dto';

@Injectable()
export class FeedingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFeedingLogDto) {
    return this.prisma.feedingLog.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    });
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

  async update(id: string, data: UpdateFeedingLogDto) {
    return this.prisma.feedingLog.update({
      where: { id },
      data: {
        ...data,
        ...(data.date ? { date: new Date(data.date) } : {}),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.feedingLog.delete({ where: { id } });
  }
}
