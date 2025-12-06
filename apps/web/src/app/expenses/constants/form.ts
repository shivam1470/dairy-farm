import * as Yup from 'yup';

// Expense Form Initial Values
export const expenseFormInitialValues = {
  date: '',
  category: '',
  amount: '',
  description: '',
  vendor: '',
  paymentMethod: '',
  receiptNumber: '',
  notes: '',
};

// Expense Form Validation Schema
export const expenseFormValidationSchema = Yup.object({
  date: Yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  category: Yup.string().required('Category is required'),
  amount: Yup.number().required('Amount is required').min(0, 'Amount must be positive'),
  description: Yup.string().required('Description is required'),
  vendor: Yup.string(),
  paymentMethod: Yup.string().required('Payment method is required'),
  receiptNumber: Yup.string(),
  notes: Yup.string(),
});

// Type for form values
export type ExpenseFormValues = typeof expenseFormInitialValues;
