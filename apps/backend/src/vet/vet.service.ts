import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVetVisitDto } from './dto/create-vet-visit.dto';
import { UpdateVetVisitDto } from './dto/update-vet-visit.dto';

@Injectable()
export class VetService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, data: CreateVetVisitDto) {
    const farmId = this.requireFarmId(user);
    await this.ensureAnimalAccess(farmId, data.animalId);
    return this.prisma.vetVisit.create({
      data: {
        ...data,
        visitDate: new Date(data.visitDate),
        ...(data.nextVisitDate ? { nextVisitDate: new Date(data.nextVisitDate) } : {}),
      },
    });
  }

  async findAll(user: any, animalId?: string) {
    const farmId = this.requireFarmId(user);
    if (animalId) await this.ensureAnimalAccess(farmId, animalId);
    return this.prisma.vetVisit.findMany({
      where: animalId ? { animalId, animal: { farmId } } : { animal: { farmId } },
      include: { animal: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(user: any, id: string) {
    const farmId = this.requireFarmId(user);
    const visit = await this.prisma.vetVisit.findFirst({
      where: { id, animal: { farmId } },
    });
    if (!visit) throw new NotFoundException('Vet visit not found');
    return visit;
  }

  async update(user: any, id: string, data: UpdateVetVisitDto) {
    const existingVisit = await this.findOne(user, id);
    const farmId = this.requireFarmId(user);
    if ((data as any).animalId) await this.ensureAnimalAccess(farmId, (data as any).animalId);
    return this.prisma.vetVisit.update({
      where: { id },
      data: {
        ...data,
        animalId: (data as any).animalId ?? existingVisit.animalId,
        ...(data.visitDate ? { visitDate: new Date(data.visitDate) } : {}),
        ...(data.nextVisitDate ? { nextVisitDate: new Date(data.nextVisitDate) } : {}),
      },
    });
  }

  async remove(user: any, id: string) {
    await this.findOne(user, id);
    return this.prisma.vetVisit.delete({ where: { id } });
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
