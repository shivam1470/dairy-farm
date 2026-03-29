import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MilkRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, data: any) {
    const farmId = this.requireFarmId(user);
    await this.ensureAnimalAccess(farmId, data.animalId);

    // Ensure `date` is a Date object for Prisma DateTime.
    // Frontends commonly send YYYY-MM-DD or ISO strings.
    const normalized = {
      ...data,
      farmId,
      date: data?.date ? new Date(data.date) : data?.date,
    };

    return this.prisma.milkRecord.create({
      data: normalized,
    });
  }

  async findAll(user: any, animalId?: string) {
    const farmId = this.requireFarmId(user);
    if (animalId) await this.ensureAnimalAccess(farmId, animalId);
    return this.prisma.milkRecord.findMany({
      where: animalId ? { animalId, farmId } : { farmId },
      include: { animal: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(user: any, id: string) {
    const farmId = this.requireFarmId(user);
    const record = await this.prisma.milkRecord.findFirst({
      where: { id, farmId },
      include: { animal: true },
    });

    if (!record) throw new NotFoundException('Milk record not found');
    return record;
  }

  async update(user: any, id: string, data: any) {
    const existingRecord = await this.findOne(user, id);
    const farmId = this.requireFarmId(user);
    if (data?.animalId) await this.ensureAnimalAccess(farmId, data.animalId);
    const { farmId: _farmId, ...safeData } = data;
    const normalized = {
      ...safeData,
      farmId: existingRecord.farmId,
      animalId: data?.animalId ?? existingRecord.animalId,
      ...(data?.date ? { date: new Date(data.date) } : {}),
    };
    return this.prisma.milkRecord.update({ where: { id }, data: normalized });
  }

  async remove(user: any, id: string) {
    await this.findOne(user, id);
    return this.prisma.milkRecord.delete({ where: { id } });
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
