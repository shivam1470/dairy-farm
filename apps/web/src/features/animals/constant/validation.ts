import * as Yup from 'yup';
import { AnimalGender, AnimalCategory, AnimalStatus } from '@dairy-farm/types';

/**
 * Validation schema for animal form
 */
export const animalValidationSchema = Yup.object({
  tagNumber: Yup.string()
    .required('Tag number is required')
    .min(1, 'Tag number cannot be empty')
    .max(50, 'Tag number cannot exceed 50 characters'),

  name: Yup.string()
    .optional()
    .max(100, 'Name cannot exceed 100 characters'),

  breed: Yup.string()
    .required('Breed is required')
    .min(1, 'Breed cannot be empty')
    .max(100, 'Breed cannot exceed 100 characters'),

  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),

  gender: Yup.mixed<AnimalGender>()
    .oneOf(Object.values(AnimalGender), 'Invalid gender')
    .required('Gender is required'),

  category: Yup.mixed<AnimalCategory>()
    .oneOf(Object.values(AnimalCategory), 'Invalid category')
    .required('Category is required'),

  status: Yup.mixed<AnimalStatus>()
    .oneOf(Object.values(AnimalStatus), 'Invalid status')
    .required('Status is required'),

  farmId: Yup.string()
    .required('Farm ID is required'),

  purchaseDate: Yup.date()
    .optional()
    .nullable()
    .max(new Date(), 'Purchase date cannot be in the future'),

  purchasePrice: Yup.number()
    .optional()
    .nullable()
    .positive('Purchase price must be positive')
    .max(999999.99, 'Purchase price cannot exceed $999,999.99'),

  currentWeight: Yup.number()
    .optional()
    .nullable()
    .positive('Current weight must be positive')
    .max(9999.99, 'Current weight cannot exceed 9,999.99 kg'),

  notes: Yup.string()
    .optional()
    .max(1000, 'Notes cannot exceed 1000 characters'),
});