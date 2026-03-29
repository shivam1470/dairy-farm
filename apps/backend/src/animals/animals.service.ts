import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnimalDto } from './dto/create-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, dto: CreateAnimalDto) {
    const farmId = this.requireFarmId(user);

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

  async findAll(user: any) {
    const farmId = this.requireFarmId(user);
    return this.prisma.animal.findMany({ where: { farmId } });
  }

  async findOne(user: any, id: string) {
    const farmId = this.requireFarmId(user);
    const animal = await this.prisma.animal.findFirst({ where: { id, farmId } });
    if (!animal) throw new NotFoundException('Animal not found');
    return animal;
  }

  async update(user: any, id: string, data: any) {
    await this.findOne(user, id);
    const { farmId: _farmId, ...safeData } = data;
    return this.prisma.animal.update({ where: { id }, data: safeData });
  }

  async remove(user: any, id: string) {
    await this.findOne(user, id);
    return this.prisma.animal.delete({ where: { id } });
  }

  private requireFarmId(user: any) {
    if (!user?.farmId) throw new ForbiddenException('User is not assigned to a farm');
    return user.farmId as string;
  }
}
