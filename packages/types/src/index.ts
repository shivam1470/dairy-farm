// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  farmId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  WORKER = 'WORKER',
  VIEWER = 'VIEWER',
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  farmName?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Farm Types
export interface Farm {
  id: string;
  name: string;
  location: string;
  totalArea?: number;
  ownerName: string;
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFarmDto {
  name: string;
  location: string;
  totalArea?: number;
  ownerName: string;
  contactNumber: string;
}

// Animal Types
export interface Animal {
  id: string;
  tagNumber: string;
  name?: string;
  breed: string;
  dateOfBirth: Date;
  timeOfBirth?: Date;
  gender: AnimalGender;
  type: AnimalType;
  lifeStage: LifeStage;
  status: AnimalStatus;
  acquisitionType: AnimalAcquisitionType;
  farmId: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  purchaseFromName?: string;
  purchaseFromMobile?: string;
  purchaseFromEmail?: string;
  currentWeight?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AnimalGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AnimalType {
  COW = 'COW',
  BUFFALO = 'BUFFALO',
}

export enum LifeStage {
  CALF = 'CALF',
  HEIFER = 'HEIFER',
  ADULT = 'ADULT',
}

export enum AnimalStatus {
  ACTIVE = 'ACTIVE',
  PREGNANT = 'PREGNANT',
  SICK = 'SICK',
  SOLD = 'SOLD',
  DECEASED = 'DECEASED',
}

export enum AnimalAcquisitionType {
  BORN = 'BORN',
  PURCHASED = 'PURCHASED',
}

export interface CreateAnimalDto {
  tagNumber: string;
  name?: string;
  breed: string;
  dateOfBirth: Date;
  timeOfBirth?: Date;
  gender: AnimalGender;
  type: AnimalType;
  lifeStage: LifeStage;
  status: AnimalStatus;
  acquisitionType: AnimalAcquisitionType;
  farmId: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  purchaseFromName?: string;
  purchaseFromMobile?: string;
  purchaseFromEmail?: string;
}

// Milk Record Types
export interface MilkRecord {
  id: string;
  animalId: string;
  date: Date;
  morningQuantity: number;
  eveningQuantity: number;
  totalQuantity: number;
  quality?: MilkQuality;
  notes?: string;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum MilkQuality {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  POOR = 'POOR',
}

export interface CreateMilkRecordDto {
  animalId: string;
  date: Date;
  morningQuantity: number;
  eveningQuantity: number;
  quality?: MilkQuality;
  notes?: string;
}

// Expense Types
export interface Expense {
  id: string;
  farmId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: Date;
  paymentMethod?: string;
  invoiceNumber?: string;
  vendorName?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ExpenseCategory {
  FEED = 'FEED',
  MEDICINE = 'MEDICINE',
  EQUIPMENT = 'EQUIPMENT',
  LABOR = 'LABOR',
  UTILITIES = 'UTILITIES',
  MAINTENANCE = 'MAINTENANCE',
  VETERINARY = 'VETERINARY',
  TRANSPORT = 'TRANSPORT',
  OTHER = 'OTHER',
}

export interface CreateExpenseDto {
  farmId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: Date;
  paymentMethod?: string;
  invoiceNumber?: string;
  vendorName?: string;
  notes?: string;
}

// Worker Types
export interface Worker {
  id: string;
  farmId: string;
  name: string;
  contactNumber: string;
  email?: string;
  address?: string;
  role: WorkerRole;
  shift: WorkerShift;
  salary: number;
  joinDate: Date;
  status: WorkerStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum WorkerRole {
  MANAGER = 'MANAGER',
  SUPERVISOR = 'SUPERVISOR',
  MILKER = 'MILKER',
  FEEDER = 'FEEDER',
  CLEANER = 'CLEANER',
  DRIVER = 'DRIVER',
  VETERINARIAN = 'VETERINARIAN',
  OTHER = 'OTHER',
}

export enum WorkerShift {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
  DAY = 'DAY',
  FULL_TIME = 'FULL_TIME',
}

export enum WorkerStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  RESIGNED = 'RESIGNED',
  TERMINATED = 'TERMINATED',
}

export interface CreateWorkerDto {
  farmId: string;
  name: string;
  contactNumber: string;
  email?: string;
  address?: string;
  role: WorkerRole;
  shift: WorkerShift;
  salary: number;
  joinDate: string;
  status: WorkerStatus;
  notes?: string;
}

// Task Types
export interface Task {
  id: string;
  farmId: string;
  title: string;
  description?: string;
  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface CreateTaskDto {
  farmId: string;
  title: string;
  description?: string;
  assignedToId?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
  createdById: string;
}

// Feeding Log Types
export interface FeedingLog {
  id: string;
  farmId: string;
  animalId: string;
  date: Date;
  feedingTime: FeedingTime;
  feedType: FeedType;
  quantity: number;
  cost?: number;
  notes?: string;
  recordedById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeedingLogDto {
  farmId: string;
  animalId: string;
  date: string;
  feedingTime: FeedingTime;
  feedType: FeedType;
  quantity: number;
  cost?: number;
  notes?: string;
  recordedById: string;
}

export enum FeedingTime {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}

export enum FeedType {
  HAY = 'HAY',
  SILAGE = 'SILAGE',
  CONCENTRATE = 'CONCENTRATE',
  GRAINS = 'GRAINS',
  MINERAL_SUPPLEMENTS = 'MINERAL_SUPPLEMENTS',
  FRESH_GRASS = 'FRESH_GRASS',
}

// Delivery Log Types
export interface DeliveryLog {
  id: string;
  farmId: string;
  deliveryDate: Date;
  buyerName: string;
  buyerPhone?: string;
  quantity: number;
  pricePerLiter: number;
  totalAmount: number;
  deliveryStatus: DeliveryStatus;
  paymentStatus: PaymentStatus;
  address?: string;
  notes?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
}

export interface CreateDeliveryLogDto {
  farmId: string;
  deliveryDate: string;
  buyerName: string;
  buyerPhone?: string;
  quantity: number;
  pricePerLiter: number;
  totalAmount: number;
  deliveryStatus: DeliveryStatus;
  paymentStatus: PaymentStatus;
  address?: string;
  notes?: string;
  createdById: string;
}

// Vet Visit Types
export interface VetVisit {
  id: string;
  animalId: string;
  visitDate: Date;
  visitType?: VetVisitType;
  visitReason: string;
  treatmentType?: TreatmentType;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  veterinarian: string;
  cost: number;
  visitStatus: VetVisitStatus;
  nextVisitDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVetVisitDto {
  animalId: string;
  visitDate: string;
  visitType?: VetVisitType;
  visitReason: string;
  treatmentType?: TreatmentType;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  veterinarian: string;
  cost: number;
  visitStatus: VetVisitStatus;
  nextVisitDate?: string;
  notes?: string;
}

export enum VetVisitType {
  ROUTINE = 'ROUTINE',
  EMERGENCY = 'EMERGENCY',
  FOLLOWUP = 'FOLLOWUP',
  VACCINATION = 'VACCINATION',
  CHECKUP = 'CHECKUP',
}

export enum TreatmentType {
  VACCINATION = 'VACCINATION',
  MEDICATION = 'MEDICATION',
  SURGERY = 'SURGERY',
  CHECKUP = 'CHECKUP',
  DEWORMING = 'DEWORMING',
  OTHER = 'OTHER',
}

export enum VetVisitStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Dashboard & Analytics Types
export interface DashboardStats {
  totalAnimals: number;
  activeAnimals: number;
  totalMilkToday: number;
  totalExpensesThisMonth: number;
  totalWorkersActive: number;
  pendingTasks: number;
}

export interface MilkProduction {
  date: string;
  quantity: number;
}

export interface ExpenseSummary {
  category: ExpenseCategory;
  total: number;
}

// Payment Types
export interface Payment {
  id: string;
  type: PaymentType;
  category: PaymentCategory;
  amount: number;
  description: string;
  date: Date; // When entry was added
  transactionDate: Date; // When money actually moved
  paymentMethod: PaymentMethod;
  farmId: string;
  referenceId?: string;
  referenceType?: ReferenceType;
  notes?: string;
  isDeleted: boolean;
  createdById: string;
  creator?: {
    name: string;
    email: string;
  };
  farm?: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum PaymentCategory {
  MILK_SALES = 'MILK_SALES',
  ANIMAL_SALES = 'ANIMAL_SALES',
  FEED = 'FEED',
  MEDICINE = 'MEDICINE',
  EQUIPMENT = 'EQUIPMENT',
  LABOR = 'LABOR',
  UTILITIES = 'UTILITIES',
  MAINTENANCE = 'MAINTENANCE',
  VETERINARY = 'VETERINARY',
  TRANSPORT = 'TRANSPORT',
  INVESTMENT = 'INVESTMENT',
  OTHER_INCOME = 'OTHER_INCOME',
  OTHER_EXPENSE = 'OTHER_EXPENSE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
}

export enum ReferenceType {
  EXPENSE = 'EXPENSE',
  DELIVERY = 'DELIVERY',
  VET_VISIT = 'VET_VISIT',
  FEEDING_LOG = 'FEEDING_LOG',
  OTHER = 'OTHER',
}

export interface CreatePaymentDto {
  type: PaymentType;
  category: PaymentCategory;
  amount: number;
  description: string;
  date: string; // When entry was added
  transactionDate: string; // When money actually moved
  paymentMethod: PaymentMethod;
  farmId: string;
  referenceId?: string;
  referenceType?: ReferenceType;
  notes?: string;
}

export interface UpdatePaymentDto {
  type?: PaymentType;
  category?: PaymentCategory;
  amount?: number;
  description?: string;
  date?: string;
  transactionDate?: string;
  paymentMethod?: PaymentMethod;
  referenceId?: string;
  referenceType?: ReferenceType;
  notes?: string;
  isDeleted?: boolean;
}

// Wallet Types
export interface Wallet {
  id: string;
  farmId: string;
  currentBalance: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletSummary {
  id: string;
  farmId: string;
  currentBalance: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
  recentTransactions: Payment[];
  monthlySummary: {
    income: number;
    expenses: number;
    net: number;
  };
}
