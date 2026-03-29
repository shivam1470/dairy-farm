import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(farmId?: string) {
    const resolvedFarmId = this.requireFarmId(farmId);
    let wallet = await this.prisma.wallet.findUnique({
      where: { farmId: resolvedFarmId }
    });

    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await this.prisma.wallet.create({
        data: { farmId: resolvedFarmId, currentBalance: 0 }
      });
    }

    return wallet;
  }

  async getWalletWithTransactions(farmId?: string) {
    const resolvedFarmId = this.requireFarmId(farmId);
    const wallet = await this.getWallet(resolvedFarmId);

    // Get recent transactions
    const recentPayments = await this.prisma.payment.findMany({
      where: { farmId: resolvedFarmId },
      orderBy: { date: 'desc' },
      take: 10,
      include: {
        creator: {
          select: { name: true }
        }
      }
    });

    // Calculate monthly summary
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyPayments = await this.prisma.payment.findMany({
      where: {
        farmId: resolvedFarmId,
        date: {
          gte: currentMonth
        }
      }
    });

    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    monthlyPayments.forEach(payment => {
      if (payment.type === 'INCOME') {
        monthlyIncome += payment.amount;
      } else {
        monthlyExpenses += payment.amount;
      }
    });

    return {
      ...wallet,
      recentTransactions: recentPayments,
      monthlySummary: {
        income: monthlyIncome,
        expenses: monthlyExpenses,
        net: monthlyIncome - monthlyExpenses
      }
    };
  }

  async updateWalletBalance(farmId: string) {
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
    const wallet = await this.prisma.wallet.upsert({
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

    return wallet;
  }

  private requireFarmId(farmId?: string) {
    if (!farmId) throw new ForbiddenException('User is not assigned to a farm');
    return farmId;
  }
}
