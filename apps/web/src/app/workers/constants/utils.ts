import { WorkerFormValues } from './form';

/**
 * Transform worker form values to API payload
 */
export const transformWorkerFormToPayload = (values: WorkerFormValues, farmId: string) => {
  return {
    name: values.name,
    contactNumber: values.phone,
    email: values.email || null,
    role: values.role.toUpperCase(),
    status: values.status.toUpperCase(),
    shift: values.shift.toUpperCase(),
    salary: parseFloat(values.salary),
    joinDate: new Date(values.joinDate).toISOString(),
    address: values.address || null,
    notes: values.notes || null,
    farmId,
  };
};
