// Milk Session Options
export const MILK_SESSION_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
] as const;

// Milk Quality Options
export const MILK_QUALITY_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'average', label: 'Average' },
  { value: 'poor', label: 'Poor' },
] as const;

// Field Labels
export const FIELD_LABELS = {
  animalId: 'Animal',
  date: 'Date',
  session: 'Session',
  quantity: 'Quantity (L)',
  fat: 'Fat Content (%)',
  quality: 'Quality',
  notes: 'Notes',
} as const;
