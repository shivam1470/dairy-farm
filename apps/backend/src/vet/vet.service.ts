import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VetService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.vetVisit.create({ data });
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

  async update(id: string, data: any) {
    return this.prisma.vetVisit.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.vetVisit.delete({ where: { id } });
  }
}
