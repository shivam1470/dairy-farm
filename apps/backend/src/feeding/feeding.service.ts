import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedingLogDto } from './dto/create-feeding-log.dto';
import { UpdateFeedingLogDto } from './dto/update-feeding-log.dto';

@Injectable()
export class FeedingService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, data: CreateFeedingLogDto) {
    const farmId = this.requireFarmId(user);
    await this.ensureAnimalAccess(farmId, data.animalId);
    return this.prisma.feedingLog.create({
      data: {
        ...data,
        farmId,
        recordedById: user.id,
        date: new Date(data.date),
      },
    });
  }

  async findAll(user: any, animalId?: string) {
    const farmId = this.requireFarmId(user);
    if (animalId) await this.ensureAnimalAccess(farmId, animalId);
    return this.prisma.feedingLog.findMany({
      where: animalId ? { animalId, farmId } : { farmId },
      include: { animal: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(user: any, id: string) {
    const farmId = this.requireFarmId(user);
    const feedingLog = await this.prisma.feedingLog.findFirst({ where: { id, farmId } });
    if (!feedingLog) throw new NotFoundException('Feeding log not found');
    return feedingLog;
  }

  async update(user: any, id: string, data: UpdateFeedingLogDto) {
    const existingLog = await this.findOne(user, id);
    const farmId = this.requireFarmId(user);
    if ((data as any).animalId) await this.ensureAnimalAccess(farmId, (data as any).animalId);
    const { farmId: _farmId, recordedById: _recordedById, ...safeData } = data as any;
    return this.prisma.feedingLog.update({
      where: { id },
      data: {
        ...safeData,
        farmId: existingLog.farmId,
        animalId: (data as any).animalId ?? existingLog.animalId,
        ...(data.date ? { date: new Date(data.date) } : {}),
      },
    });
  }

  async remove(user: any, id: string) {
    await this.findOne(user, id);
    return this.prisma.feedingLog.delete({ where: { id } });
  }

  private requireFarmId(user: any) {
    if (!user?.farmId) throw new ForbiddenException('User is not assigned to a farm');
    return user.farmId as string;
  }

  private async ensureAnimalAccess(farmId: string, animalId: string) {
    const animal = await this.prisma.animal.findFirst({
      where: { id: animalId, farmId },
      select: { id: true },
    });

    if (!animal) throw new NotFoundException('Animal not found');
  }
}
