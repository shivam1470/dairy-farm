import * as Yup from 'yup';

// Animal Form Initial Values
export const animalFormInitialValues = {
  tagNumber: '',
  type: '',
  breed: '',
  dateOfBirth: '',
  purchaseDate: '',
  purchasePrice: '',
  healthStatus: '',
  weight: '',
  medicalHistory: '',
  vaccinationRecords: '',
  milkStatus: '',
  expectedDailyMilk: '',
  specialCare: '',
  notes: '',
};

// Animal Form Validation Schema
export const animalFormValidationSchema = Yup.object({
  tagNumber: Yup.string().required('Animal ID/Tag Number is required'),
  type: Yup.string().required('Animal Type is required'),
  breed: Yup.string().required('Breed is required'),
  dateOfBirth: Yup.date()
    .required('Date of Birth is required')
    .max(new Date(), 'Date cannot be in the future'),
  purchaseDate: Yup.date().nullable(),
  purchasePrice: Yup.number().min(0, 'Price must be positive').nullable(),
  healthStatus: Yup.string().required('Health Status is required'),
  weight: Yup.number().min(0, 'Weight must be positive').nullable(),
  medicalHistory: Yup.string(),
  vaccinationRecords: Yup.string(),
  milkStatus: Yup.string(),
  expectedDailyMilk: Yup.number().min(0, 'Expected milk must be positive').nullable(),
  specialCare: Yup.string(),
  notes: Yup.string(),
});

// Type for form values
export type AnimalFormValues = typeof animalFormInitialValues;
