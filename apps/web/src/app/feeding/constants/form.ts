import * as Yup from 'yup';

// Feeding Form Initial Values
export const feedingFormInitialValues = {
  animalId: '',
  date: '',
  time: '',
  feedType: '',
  quantity: '',
  cost: '',
  recordedBy: '',
  notes: '',
};

// Feeding Form Validation Schema
export const feedingFormValidationSchema = Yup.object({
  animalId: Yup.string().required('Animal is required'),
  date: Yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  time: Yup.string().required('Feeding time is required'),
  feedType: Yup.string().required('Feed type is required'),
  quantity: Yup.number().required('Quantity is required').min(0, 'Quantity must be positive'),
  cost: Yup.number().min(0, 'Cost must be positive').nullable(),
  recordedBy: Yup.string(),
  notes: Yup.string(),
});

// Type for form values
export type FeedingFormValues = typeof feedingFormInitialValues;
