import { MilkRecordFormValues } from './form';

/**
 * Transform milk record form values to API payload
 */
export const transformMilkRecordFormToPayload = (values: MilkRecordFormValues, farmId: string) => {
  return {
    animalId: values.animalId,
    date: new Date(values.date).toISOString(),
    session: values.session.toUpperCase(),
    quantity: parseFloat(values.quantity),
    fatContent: values.fat ? parseFloat(values.fat) : null,
    quality: values.quality ? values.quality.toUpperCase() : null,
    notes: values.notes || null,
    farmId,
  };
};
