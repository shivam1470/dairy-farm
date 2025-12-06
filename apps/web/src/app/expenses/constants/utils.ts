import { ExpenseFormValues } from './form';

/**
 * Transform expense form values to API payload
 */
export const transformExpenseFormToPayload = (values: ExpenseFormValues, userId: string, farmId: string) => {
  return {
    date: new Date(values.date).toISOString(),
    category: values.category.toUpperCase(),
    amount: parseFloat(values.amount),
    description: values.description,
    vendor: values.vendor || null,
    paymentMethod: values.paymentMethod.toUpperCase(),
    receiptNumber: values.receiptNumber || null,
    notes: values.notes || null,
    createdById: userId,
    farmId,
  };
};
