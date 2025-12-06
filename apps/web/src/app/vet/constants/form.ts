import * as Yup from 'yup';

// Vet Form Initial Values
export const vetFormInitialValues = {
  animalId: '',
  visitDate: '',
  visitType: 'checkup',
  treatmentType: 'medication',
  diagnosis: '',
  prescription: '',
  vetName: '',
  cost: '',
  status: 'scheduled',
  nextVisitDate: '',
  notes: '',
};

// Vet Form Validation Schema
export const vetFormValidationSchema = Yup.object({
  animalId: Yup.string().required('Animal is required'),
  visitDate: Yup.date().required('Visit date is required'),
  visitType: Yup.string().required('Visit type is required'),
  treatmentType: Yup.string().required('Treatment type is required'),
  diagnosis: Yup.string().required('Diagnosis is required'),
  prescription: Yup.string(),
  vetName: Yup.string().required('Veterinarian name is required'),
  cost: Yup.number().required('Cost is required').min(0, 'Cost must be positive'),
  status: Yup.string().required('Status is required'),
  nextVisitDate: Yup.date().nullable(),
  notes: Yup.string(),
});

// Type for form values
export type VetFormValues = typeof vetFormInitialValues;
