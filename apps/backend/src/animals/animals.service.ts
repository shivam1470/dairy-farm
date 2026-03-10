import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnimalDto } from './dto/create-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, dto: CreateAnimalDto) {
    const farmId = user?.farmId ?? dto.farmId;

    const data: any = {
      ...dto,
      farmId,
      dateOfBirth: new Date(dto.dateOfBirth),
      timeOfBirth: dto.timeOfBirth ? new Date(dto.timeOfBirth) : undefined,
      purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
    };

    // Prisma doesn't like undefined for non-present optional fields in some cases.
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    return this.prisma.animal.create({ data });
  }

  async findAll(user: any, farmId?: string) {
    const resolvedFarmId = farmId ?? user?.farmId;
    return this.prisma.animal.findMany({ where: { farmId: resolvedFarmId } });
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
