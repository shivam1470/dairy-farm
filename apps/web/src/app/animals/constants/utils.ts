import { AnimalFormValues } from './form';

/**
 * Transform form values to API payload format
 */
export const transformAnimalFormToPayload = (
  values: AnimalFormValues,
  farmId: string
) => {
  return {
    tagNumber: values.tagNumber,
    category: values.type.toUpperCase(),
    breed: values.breed,
    gender: 'FEMALE' as const, // TODO: Make this dynamic when gender field is added
    dateOfBirth: new Date(values.dateOfBirth).toISOString(),
    purchaseDate: values.purchaseDate
      ? new Date(values.purchaseDate).toISOString()
      : null,
    purchasePrice: values.purchasePrice
      ? parseFloat(values.purchasePrice)
      : null,
    status: values.healthStatus.toUpperCase(),
    currentWeight: values.weight ? parseFloat(values.weight) : null,
    farmId,
    notes: [
      values.medicalHistory && `Medical History: ${values.medicalHistory}`,
      values.vaccinationRecords &&
        `Vaccinations: ${values.vaccinationRecords}`,
      values.specialCare && `Special Care: ${values.specialCare}`,
      values.notes && `Notes: ${values.notes}`,
    ]
      .filter(Boolean)
      .join('\n'),
  };
};

/**
 * Get fields to validate for each form step
 */
export const getFieldsForStep = (step: number): string[] => {
  switch (step) {
    case 0:
      return ['tagNumber', 'type', 'breed', 'dateOfBirth'];
    case 1:
      return ['healthStatus'];
    case 2:
      return [];
    default:
      return [];
  }
};
