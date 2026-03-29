export interface MenuItem {
  text: string;
  path: string;
  icon: string;
  roles?: string[]; // For future role-based access
}

export const menuItems: MenuItem[] = [
  { text: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
  { text: 'Farm Development', path: '/farm-development', icon: 'Construction' },
  { text: 'Animals', path: '/animals', icon: 'Pets' },
  { text: 'Milk Records', path: '/milk-records', icon: 'Opacity' },
  { text: 'Payments', path: '/payments', icon: 'Payment', roles: ['ADMIN', 'MANAGER'] },
  { text: 'Workers', path: '/workers', icon: 'People', roles: ['ADMIN', 'MANAGER'] },
  { text: 'Tasks', path: '/tasks', icon: 'Assignment' },
  { text: 'Deliveries', path: '/deliveries', icon: 'LocalShipping' },
  { text: 'Feeding', path: '/feeding', icon: 'Restaurant' },
  { text: 'Vet Visits', path: '/vet', icon: 'MedicalServices' },
  { text: 'Settings', path: '/settings', icon: 'Settings', roles: ['ADMIN', 'MANAGER'] }
];

// Icon mapping for type safety
export const iconMap = {
  Dashboard: 'Dashboard',
  Construction: 'Construction',
  Pets: 'Pets',
  Opacity: 'Opacity',
  AttachMoney: 'AttachMoney',
  Payment: 'Payment',
  AccountBalanceWallet: 'AccountBalanceWallet',
  People: 'People',
  Assignment: 'Assignment',
  LocalShipping: 'LocalShipping',
  Restaurant: 'Restaurant',
  MedicalServices: 'MedicalServices',
  Settings: 'Settings'
} as const;

export type IconName = keyof typeof iconMap;
