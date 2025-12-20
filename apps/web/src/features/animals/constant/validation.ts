import * as Yup from 'yup';
import { AnimalGender, AnimalType, LifeStage, AnimalStatus, AnimalAcquisitionType } from '@dairy-farm/types';

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
    .optional()
    .nullable()
    .max(new Date(), 'Date of birth cannot be in the future'),

  timeOfBirth: Yup.date()
    .optional()
    .nullable(),

  gender: Yup.mixed<AnimalGender>()
    .oneOf(Object.values(AnimalGender), 'Invalid gender')
    .required('Gender is required'),

  type: Yup.mixed<AnimalType>()
    .oneOf(Object.values(AnimalType), 'Invalid animal type')
    .required('Animal type is required'),

  lifeStage: Yup.mixed<LifeStage>()
    .oneOf(Object.values(LifeStage), 'Invalid life stage')
    .required('Life stage is required'),

  status: Yup.mixed<AnimalStatus>()
    .oneOf(Object.values(AnimalStatus), 'Invalid status')
    .required('Status is required'),

  acquisitionType: Yup.mixed<AnimalAcquisitionType>()
    .oneOf(Object.values(AnimalAcquisitionType), 'Invalid acquisition type')
    .required('Acquisition type is required'),

  farmId: Yup.string()
    .required('Farm ID is required'),

  purchaseDate: Yup.date()
    .optional()
    .nullable()
    .when('acquisitionType', {
      is: AnimalAcquisitionType.PURCHASED,
      then: (schema) => schema.required('Purchase date is required for purchased animals'),
    }),

  purchasePrice: Yup.number()
    .optional()
    .nullable()
    .positive('Purchase price must be positive')
    .max(999999.99, 'Purchase price cannot exceed $999,999.99')
    .when('acquisitionType', {
      is: AnimalAcquisitionType.PURCHASED,
      then: (schema) => schema.required('Purchase price is required for purchased animals'),
    }),

  purchaseFromName: Yup.string()
    .optional()
    .max(100, 'Purchase from name cannot exceed 100 characters')
    .when('acquisitionType', {
      is: AnimalAcquisitionType.PURCHASED,
      then: (schema) => schema.required('Purchase from name is required for purchased animals'),
    }),

  purchaseFromMobile: Yup.string()
    .optional()
    .matches(/^[0-9+\-\s()]+$/, 'Invalid mobile number format')
    .max(20, 'Mobile number cannot exceed 20 characters'),

  purchaseFromEmail: Yup.string()
    .optional()
    .email('Invalid email format')
    .max(100, 'Email cannot exceed 100 characters'),

  currentWeight: Yup.number()
    .optional()
    .nullable()
    .positive('Current weight must be positive')
    .max(9999.99, 'Current weight cannot exceed 9,999.99 kg'),

  notes: Yup.string()
    .optional()
    .max(1000, 'Notes cannot exceed 1000 characters'),
});