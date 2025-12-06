import { VetFormValues } from './form';

// Transform form values to API payload
export const transformVetFormToPayload = (values: VetFormValues) => {
  return {
    animalId: values.animalId,
    visitDate: new Date(values.visitDate).toISOString(),
    visitType: values.visitType,
    treatmentType: values.treatmentType,
    diagnosis: values.diagnosis,
    prescription: values.prescription || undefined,
    vetName: values.vetName,
    cost: parseFloat(values.cost),
    status: values.status,
    nextVisitDate: values.nextVisitDate ? new Date(values.nextVisitDate).toISOString() : undefined,
    notes: values.notes || undefined,
  };
};
