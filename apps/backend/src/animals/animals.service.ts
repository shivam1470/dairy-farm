import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.animal.create({ data });
  }

  async findAll(farmId: string) {
    return this.prisma.animal.findMany({ where: { farmId } });
  }

  async findOne(id: string) {
    return this.prisma.animal.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.animal.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.animal.delete({ where: { id } });
  }
}
