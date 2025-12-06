// Task Priority Options
export const TASK_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
] as const;

// Task Status Options
export const TASK_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

// Field Labels
export const FIELD_LABELS = {
  title: 'Task Title',
  description: 'Description',
  assignedTo: 'Assigned To',
  priority: 'Priority',
  status: 'Status',
  dueDate: 'Due Date',
  notes: 'Notes',
} as const;
