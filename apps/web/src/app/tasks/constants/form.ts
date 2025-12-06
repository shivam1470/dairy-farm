import * as Yup from 'yup';

// Task Form Initial Values
export const taskFormInitialValues = {
  title: '',
  description: '',
  assignedTo: '',
  priority: '',
  status: 'pending',
  dueDate: '',
  notes: '',
};

// Task Form Validation Schema
export const taskFormValidationSchema = Yup.object({
  title: Yup.string().required('Task title is required'),
  description: Yup.string().required('Description is required'),
  assignedTo: Yup.string(),
  priority: Yup.string().required('Priority is required'),
  status: Yup.string().required('Status is required'),
  dueDate: Yup.date().required('Due date is required'),
  notes: Yup.string(),
});

// Type for form values
export type TaskFormValues = typeof taskFormInitialValues;
