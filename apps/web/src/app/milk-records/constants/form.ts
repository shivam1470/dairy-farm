import * as Yup from 'yup';

// Milk Record Form Initial Values
export const milkRecordFormInitialValues = {
  animalId: '',
  date: '',
  session: '',
  quantity: '',
  fat: '',
  quality: '',
  notes: '',
};

// Milk Record Form Validation Schema
export const milkRecordFormValidationSchema = Yup.object({
  animalId: Yup.string().required('Animal is required'),
  date: Yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  session: Yup.string().required('Session is required'),
  quantity: Yup.number().required('Quantity is required').min(0, 'Quantity must be positive'),
  fat: Yup.number().min(0, 'Fat content must be positive').max(100, 'Fat content cannot exceed 100%').nullable(),
  quality: Yup.string(),
  notes: Yup.string(),
});

// Type for form values
export type MilkRecordFormValues = typeof milkRecordFormInitialValues;
