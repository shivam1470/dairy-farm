/* eslint-env jest */

import { WalletService } from './wallet.service';

describe('WalletService', () => {
  const walletRecord = {
    id: 'wallet-1',
    farmId: 'farm-1',
    currentBalance: 1000,
    lastUpdated: new Date('2026-03-01T00:00:00.000Z'),
    createdAt: new Date('2026-03-01T00:00:00.000Z'),
    updatedAt: new Date('2026-03-01T00:00:00.000Z'),
  };

  it('filters soft-deleted payments from wallet summary queries', async () => {
    const prisma = {
      wallet: {
        findUnique: jest.fn().mockResolvedValue(walletRecord),
        create: jest.fn(),
      },
      payment: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce([
            {
              id: 'payment-1',
              type: 'INCOME',
              amount: 250,
              description: 'Milk sale',
              date: new Date('2026-03-10T00:00:00.000Z'),
              transactionDate: new Date('2026-03-10T00:00:00.000Z'),
              paymentMethod: 'CASH',
              farmId: 'farm-1',
              isDeleted: false,
              createdById: 'user-1',
              createdAt: new Date('2026-03-10T00:00:00.000Z'),
              updatedAt: new Date('2026-03-10T00:00:00.000Z'),
              creator: { name: 'Admin' },
            },
          ])
          .mockResolvedValueOnce([
            {
              type: 'INCOME',
              amount: 250,
            },
          ]),
      },
    };

    const service = new WalletService(prisma as any);
    const summary = await service.getWalletWithTransactions('farm-1');

    expect(prisma.payment.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: {
          farmId: 'farm-1',
          isDeleted: false,
        },
      }),
    );
    expect(prisma.payment.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: expect.objectContaining({
          farmId: 'farm-1',
          isDeleted: false,
        }),
      }),
    );
    expect(summary.monthlySummary).toEqual({
      income: 250,
      expenses: 0,
      net: 250,
    });
  });

  it('filters soft-deleted payments when recalculating wallet balance', async () => {
    const prisma = {
      payment: {
        findMany: jest.fn().mockResolvedValue([
          { type: 'INCOME', amount: 1000 },
          { type: 'EXPENSE', amount: 400 },
        ]),
      },
      wallet: {
        upsert: jest.fn().mockResolvedValue(walletRecord),
      },
    };

    const service = new WalletService(prisma as any);
    await service.updateWalletBalance('farm-1');

    expect(prisma.payment.findMany).toHaveBeenCalledWith({
      where: {
        farmId: 'farm-1',
        isDeleted: false,
      },
      select: { type: true, amount: true },
    });
    expect(prisma.wallet.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { farmId: 'farm-1' },
        update: expect.objectContaining({ currentBalance: 600 }),
        create: expect.objectContaining({ farmId: 'farm-1', currentBalance: 600 }),
      }),
    );
  });
});
