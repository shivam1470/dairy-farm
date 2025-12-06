import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.worker.create({ data });
  }

  async findAll(farmId: string) {
    return this.prisma.worker.findMany({ where: { farmId } });
  }

  async findOne(id: string) {
    return this.prisma.worker.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.worker.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.worker.delete({ where: { id } });
  }
}
