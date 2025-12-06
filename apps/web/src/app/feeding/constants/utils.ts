import { FeedingFormValues } from './form';

/**
 * Transform feeding form values to API payload
 */
export const transformFeedingFormToPayload = (values: FeedingFormValues, recordedById: string, farmId: string) => {
  return {
    animalId: values.animalId,
    date: new Date(values.date).toISOString(),
    feedingTime: values.time.toUpperCase(),
    feedType: values.feedType.toUpperCase(),
    quantity: parseFloat(values.quantity),
    cost: values.cost ? parseFloat(values.cost) : null,
    recordedById: values.recordedBy || recordedById,
    notes: values.notes || null,
    farmId,
  };
};
