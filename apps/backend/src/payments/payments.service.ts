import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

  async create(user: any, createPaymentDto: CreatePaymentDto) {
    const farmId = this.requireFarmId(user);
    const data = {
      ...createPaymentDto,
      farmId,
      date: new Date(createPaymentDto.date),
      transactionDate: new Date(createPaymentDto.transactionDate),
      createdById: user.id,
    };

    const payment = await this.prisma.payment.create({ data });

    // Update wallet balance
    await this.updateWalletBalance(farmId);

    return payment;
  }

  async findAll(user: any) {
    const farmId = this.requireFarmId(user);
    return this.prisma.payment.findMany({
      where: { 
        farmId,
        isDeleted: false
      },
      include: {
        creator: {
          select: { name: true, email: true }
        }
      },
      orderBy: { transactionDate: 'desc' }
    });
  }

  async findOne(user: any, id: string) {
    const farmId = this.requireFarmId(user);
    const payment = await this.prisma.payment.findFirst({
      where: { id, farmId },
      include: {
        creator: {
          select: { name: true, email: true }
        },
        farm: {
          select: { name: true }
        }
      }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(user: any, id: string, updatePaymentDto: UpdatePaymentDto) {
    const existingPayment = await this.findOne(user, id);
    const { farmId: _farmId, createdById: _createdById, ...safeData } = updatePaymentDto as any;

    const data = {
      ...safeData,
      ...(updatePaymentDto.date && { date: new Date(updatePaymentDto.date) }),
      ...(updatePaymentDto.transactionDate && { transactionDate: new Date(updatePaymentDto.transactionDate) })
    };

    const payment = await this.prisma.payment.update({
      where: { id },
      data
    });

    // Update wallet balance
    await this.updateWalletBalance(existingPayment.farmId);

    return payment;
  }

  async remove(user: any, id: string) {
    const payment = await this.findOne(user, id);

    await this.prisma.payment.update({
      where: { id },
      data: { isDeleted: true }
    });

    // Update wallet balance
    await this.updateWalletBalance(payment.farmId);

    return { message: 'Payment deleted successfully' };
  }

  private async updateWalletBalance(farmId: string) {
    // Calculate total income and expenses (excluding soft deleted)
    const payments = await this.prisma.payment.findMany({
      where: { 
        farmId,
        isDeleted: false
      },
      select: { type: true, amount: true }
    });

    let balance = 0;
    payments.forEach(payment => {
      if (payment.type === 'INCOME') {
        balance += payment.amount;
      } else {
        balance -= payment.amount;
      }
    });

    // Update or create wallet
    await this.prisma.wallet.upsert({
      where: { farmId },
      update: {
        currentBalance: balance,
        lastUpdated: new Date()
      },
      create: {
        farmId,
        currentBalance: balance
      }
    });
  }

  async getWallet(farmId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { farmId }
    });

    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await this.prisma.wallet.create({
        data: { farmId, currentBalance: 0 }
      });
    }

    return wallet;
  }

  async findIncome(user: any) {
    const farmId = this.requireFarmId(user);
    return this.prisma.payment.findMany({
      where: { 
        farmId,
        type: 'INCOME',
        isDeleted: false
      },
      include: {
        creator: {
          select: { name: true, email: true }
        }
      },
      orderBy: { transactionDate: 'desc' }
    });
  }

  async findExpenses(user: any) {
    const farmId = this.requireFarmId(user);
    return this.prisma.payment.findMany({
      where: { 
        farmId,
        type: 'EXPENSE',
        isDeleted: false
      },
      include: {
        creator: {
          select: { name: true, email: true }
        }
      },
      orderBy: { transactionDate: 'desc' }
    });
  }

  private requireFarmId(user: any) {
    if (!user?.farmId) throw new ForbiddenException('User is not assigned to a farm');
    return user.farmId as string;
  }
}
