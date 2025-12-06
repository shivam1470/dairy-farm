// Feed Type Options
export const FEED_TYPE_OPTIONS = [
  { value: 'hay', label: 'Hay' },
  { value: 'silage', label: 'Silage' },
  { value: 'concentrate', label: 'Concentrate' },
  { value: 'grains', label: 'Grains' },
  { value: 'supplements', label: 'Supplements' },
  { value: 'fodder', label: 'Fodder' },
  { value: 'other', label: 'Other' },
] as const;

// Feeding Time Options
export const FEEDING_TIME_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
] as const;

// Field Labels
export const FIELD_LABELS = {
  animalId: 'Animal',
  date: 'Date',
  time: 'Feeding Time',
  feedType: 'Feed Type',
  quantity: 'Quantity (kg)',
  cost: 'Cost',
  recordedBy: 'Recorded By',
  notes: 'Notes',
} as const;
