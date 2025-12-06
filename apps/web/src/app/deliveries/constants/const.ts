// Delivery Status Options
export const DELIVERY_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

// Payment Status Options
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
] as const;

// Field Labels
export const FIELD_LABELS = {
  date: 'Delivery Date',
  customerName: 'Customer Name',
  customerPhone: 'Customer Phone',
  quantity: 'Quantity (L)',
  pricePerLiter: 'Price per Liter',
  totalAmount: 'Total Amount',
  status: 'Delivery Status',
  paymentStatus: 'Payment Status',
  address: 'Delivery Address',
  notes: 'Notes',
} as const;
