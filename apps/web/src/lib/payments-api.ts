import { apiClient } from '@/lib/api';
import { Payment, CreatePaymentDto, UpdatePaymentDto, Wallet, WalletSummary } from '@dairy-farm/types';

export const paymentsApi = {
  // Get all payments for a farm
  getAll: async (farmId: string): Promise<Payment[]> => {
    const response = await apiClient.get(`/payments?farmId=${farmId}`);
    return response.data;
  },

  // Get a single payment by ID
  getById: async (id: string): Promise<Payment> => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },

  // Create a new payment
  create: async (data: CreatePaymentDto): Promise<Payment> => {
    const response = await apiClient.post('/payments', data);
    return response.data;
  },

  // Update an existing payment
  update: async (id: string, data: UpdatePaymentDto): Promise<Payment> => {
    const response = await apiClient.patch(`/payments/${id}`, data);
    return response.data;
  },

  // Delete a payment
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/payments/${id}`);
  },
};

export const walletApi = {
  // Get wallet for a farm
  getWallet: async (farmId: string): Promise<Wallet> => {
    const response = await apiClient.get(`/wallet?farmId=${farmId}`);
    return response.data;
  },

  // Get wallet with transactions summary
  getWalletSummary: async (farmId: string): Promise<WalletSummary> => {
    const response = await apiClient.get(`/wallet/summary?farmId=${farmId}`);
    return response.data;
  },
};