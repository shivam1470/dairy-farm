import { TaskFormValues } from './form';

/**
 * Transform task form values to API payload
 */
export const transformTaskFormToPayload = (values: TaskFormValues, createdById: string, farmId: string) => {
  return {
    title: values.title,
    description: values.description,
    assignedToId: values.assignedTo || null,
    priority: values.priority.toUpperCase(),
    status: values.status.toUpperCase(),
    dueDate: new Date(values.dueDate).toISOString(),
    notes: values.notes || null,
    createdById,
    farmId,
  };
};
