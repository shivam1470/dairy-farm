// Animal Type Options
export const ANIMAL_TYPE_OPTIONS = [
  { value: 'cow', label: 'Cow' },
  { value: 'calf', label: 'Calf' },
  { value: 'heifer', label: 'Heifer' },
  { value: 'bull', label: 'Bull' },
] as const;

// Animal Breed Options
export const ANIMAL_BREED_OPTIONS = [
  { value: 'Holstein', label: 'Holstein' },
  { value: 'Jersey', label: 'Jersey' },
  { value: 'Gir', label: 'Gir' },
  { value: 'Sahiwal', label: 'Sahiwal' },
  { value: 'Red Sindhi', label: 'Red Sindhi' },
  { value: 'Tharparkar', label: 'Tharparkar' },
  { value: 'Crossbreed', label: 'Crossbreed' },
] as const;

// Animal Gender Options
export const ANIMAL_GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
] as const;

// Animal Status Options
export const ANIMAL_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pregnant', label: 'Pregnant' },
  { value: 'sick', label: 'Sick' },
  { value: 'sold', label: 'Sold' },
  { value: 'deceased', label: 'Deceased' },
] as const;

// Milk Status Options
export const MILK_STATUS_OPTIONS = [
  { value: 'milking', label: 'Milking' },
  { value: 'dry', label: 'Dry' },
  { value: 'not applicable', label: 'Not Applicable' },
] as const;

// Form Step Labels
export const FORM_STEPS = ['Basic Information', 'Health Details', 'Production Info'] as const;

// Field Labels
export const FIELD_LABELS = {
  tagNumber: 'Animal ID/Tag Number',
  type: 'Animal Type',
  breed: 'Breed',
  dateOfBirth: 'Date of Birth',
  purchaseDate: 'Purchase Date',
  purchasePrice: 'Purchase Price',
  healthStatus: 'Health Status',
  weight: 'Current Weight (kg)',
  medicalHistory: 'Medical History',
  vaccinationRecords: 'Vaccination Records',
  milkStatus: 'Milk Status',
  expectedDailyMilk: 'Expected Daily Milk (L)',
  specialCare: 'Special Care Instructions',
  notes: 'Additional Notes',
} as const;
