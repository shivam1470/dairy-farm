import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto, userId: string) {
    const data = {
      ...createPaymentDto,
      date: new Date(createPaymentDto.date),
      createdById: userId,
    };

    const payment = await this.prisma.payment.create({ data });

    // Update wallet balance
    await this.updateWalletBalance(createPaymentDto.farmId);

    return payment;
  }

  async findAll(farmId: string) {
    return this.prisma.payment.findMany({
      where: { farmId },
      include: {
        creator: {
          select: { name: true, email: true }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
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

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const existingPayment = await this.findOne(id);

    const data = {
      ...updatePaymentDto,
      ...(updatePaymentDto.date && { date: new Date(updatePaymentDto.date) })
    };

    const payment = await this.prisma.payment.update({
      where: { id },
      data
    });

    // Update wallet balance
    await this.updateWalletBalance(existingPayment.farmId);

    return payment;
  }

  async remove(id: string) {
    const payment = await this.findOne(id);

    await this.prisma.payment.delete({ where: { id } });

    // Update wallet balance
    await this.updateWalletBalance(payment.farmId);

    return { message: 'Payment deleted successfully' };
  }

  private async updateWalletBalance(farmId: string) {
    // Calculate total income and expenses
    const payments = await this.prisma.payment.findMany({
      where: { farmId },
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
}