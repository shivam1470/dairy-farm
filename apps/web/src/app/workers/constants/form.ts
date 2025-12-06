import * as Yup from 'yup';

// Worker Form Initial Values
export const workerFormInitialValues = {
  name: '',
  phone: '',
  email: '',
  role: '',
  status: 'active',
  shift: '',
  salary: '',
  joinDate: '',
  address: '',
  notes: '',
};

// Worker Form Validation Schema
export const workerFormValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  email: Yup.string().email('Invalid email address'),
  role: Yup.string().required('Role is required'),
  status: Yup.string().required('Status is required'),
  shift: Yup.string().required('Shift is required'),
  salary: Yup.number().required('Salary is required').min(0, 'Salary must be positive'),
  joinDate: Yup.date().required('Join date is required').max(new Date(), 'Join date cannot be in the future'),
  address: Yup.string(),
  notes: Yup.string(),
});

// Type for form values
export type WorkerFormValues = typeof workerFormInitialValues;
