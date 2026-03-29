import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: any) {
    const farmId = this.requireFarmId(user);
    return this.prisma.user.findMany({
      where: { farmId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        farmId: true,
        createdAt: true,
      },
    });
  }

  async findOne(user: any, id: string) {
    const farmId = this.requireFarmId(user);
    const foundUser = await this.prisma.user.findFirst({
      where: { id, farmId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        farmId: true,
        createdAt: true,
      },
    });

    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser;
  }

  private requireFarmId(user: any) {
    if (!user?.farmId) throw new ForbiddenException('User is not assigned to a farm');
    return user.farmId as string;
  }
}
