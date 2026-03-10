import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVetVisitDto } from './dto/create-vet-visit.dto';
import { UpdateVetVisitDto } from './dto/update-vet-visit.dto';

@Injectable()
export class VetService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVetVisitDto) {
    return this.prisma.vetVisit.create({
      data: {
        ...data,
        visitDate: new Date(data.visitDate),
        ...(data.nextVisitDate ? { nextVisitDate: new Date(data.nextVisitDate) } : {}),
      },
    });
  }

  async findAll(animalId?: string) {
    return this.prisma.vetVisit.findMany({
      where: animalId ? { animalId } : {},
      include: { animal: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.vetVisit.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateVetVisitDto) {
    return this.prisma.vetVisit.update({
      where: { id },
      data: {
        ...data,
        ...(data.visitDate ? { visitDate: new Date(data.visitDate) } : {}),
        ...(data.nextVisitDate ? { nextVisitDate: new Date(data.nextVisitDate) } : {}),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.vetVisit.delete({ where: { id } });
  }
}
