// Expense Category Options
export const EXPENSE_CATEGORY_OPTIONS = [
  { value: 'feed', label: 'Feed' },
  { value: 'medicine', label: 'Medicine' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'labor', label: 'Labor' },
  { value: 'construction', label: 'Construction' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'other', label: 'Other' },
] as const;

// Payment Method Options
export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'cheque', label: 'Cheque' },
] as const;

// Field Labels
export const FIELD_LABELS = {
  date: 'Date',
  category: 'Category',
  amount: 'Amount',
  description: 'Description',
  vendor: 'Vendor',
  paymentMethod: 'Payment Method',
  receiptNumber: 'Receipt Number',
  notes: 'Notes',
} as const;
