// Vet Visit Type Options
export const VET_VISIT_TYPE_OPTIONS = [
  { value: 'checkup', label: 'Regular Checkup' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'surgery', label: 'Surgery' },
];

// Treatment Type Options
export const TREATMENT_TYPE_OPTIONS = [
  { value: 'medication', label: 'Medication' },
  { value: 'injection', label: 'Injection' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'deworming', label: 'Deworming' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'other', label: 'Other' },
];

// Vet Visit Status Options
export const VET_VISIT_STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Field Labels
export const FIELD_LABELS = {
  animalId: 'Animal',
  visitDate: 'Visit Date',
  visitType: 'Visit Type',
  treatmentType: 'Treatment Type',
  diagnosis: 'Diagnosis',
  prescription: 'Prescription',
  vetName: 'Veterinarian Name',
  cost: 'Cost',
  status: 'Status',
  nextVisitDate: 'Next Visit Date',
  notes: 'Notes',
};
