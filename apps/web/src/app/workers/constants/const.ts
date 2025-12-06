// Worker Role Options
export const WORKER_ROLE_OPTIONS = [
  { value: 'farm_manager', label: 'Farm Manager' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'milker', label: 'Milker' },
  { value: 'feeder', label: 'Feeder' },
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'veterinary_assistant', label: 'Veterinary Assistant' },
  { value: 'general_worker', label: 'General Worker' },
] as const;

// Worker Status Options
export const WORKER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On Leave' },
  { value: 'terminated', label: 'Terminated' },
] as const;

// Shift Options
export const SHIFT_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
  { value: 'full_day', label: 'Full Day' },
] as const;

// Field Labels
export const FIELD_LABELS = {
  name: 'Full Name',
  phone: 'Phone Number',
  email: 'Email',
  role: 'Role',
  status: 'Status',
  shift: 'Shift',
  salary: 'Salary',
  joinDate: 'Join Date',
  address: 'Address',
  notes: 'Notes',
} as const;
