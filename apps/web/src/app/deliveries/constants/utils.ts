import { DeliveryFormValues } from './form';

// Transform form values to API payload
export const transformDeliveryFormToPayload = (values: DeliveryFormValues) => {
  return {
    date: new Date(values.date).toISOString(),
    customerName: values.customerName,
    customerPhone: values.customerPhone,
    quantity: parseFloat(values.quantity),
    pricePerLiter: parseFloat(values.pricePerLiter),
    totalAmount: parseFloat(values.totalAmount),
    status: values.status,
    paymentStatus: values.paymentStatus,
    address: values.address,
    notes: values.notes || undefined,
  };
};
