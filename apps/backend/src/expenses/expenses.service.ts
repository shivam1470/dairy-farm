import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.expense.create({ data });
  }

  async findAll(farmId: string) {
    return this.prisma.expense.findMany({
      where: { farmId },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.expense.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.expense.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.expense.delete({ where: { id } });
  }
}
