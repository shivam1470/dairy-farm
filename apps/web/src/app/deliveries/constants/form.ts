import * as Yup from 'yup';

// Delivery Form Initial Values
export const deliveryFormInitialValues = {
  date: '',
  customerName: '',
  customerPhone: '',
  quantity: '',
  pricePerLiter: '',
  totalAmount: '',
  status: 'pending',
  paymentStatus: 'pending',
  address: '',
  notes: '',
};

// Delivery Form Validation Schema
export const deliveryFormValidationSchema = Yup.object({
  date: Yup.date().required('Delivery date is required'),
  customerName: Yup.string().required('Customer name is required'),
  customerPhone: Yup.string()
    .required('Customer phone is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  quantity: Yup.number().required('Quantity is required').min(0, 'Quantity must be positive'),
  pricePerLiter: Yup.number().required('Price per liter is required').min(0, 'Price must be positive'),
  totalAmount: Yup.number().required('Total amount is required').min(0, 'Amount must be positive'),
  status: Yup.string().required('Delivery status is required'),
  paymentStatus: Yup.string().required('Payment status is required'),
  address: Yup.string().required('Delivery address is required'),
  notes: Yup.string(),
});

// Type for form values
export type DeliveryFormValues = typeof deliveryFormInitialValues;
