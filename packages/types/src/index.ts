// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  farmId?: string;
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
  address?: string;
  role: string;
  salary: number;
  joiningDate: Date;
  status: WorkerStatus;
  createdAt: Date;
  updatedAt: Date;
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
  address?: string;
  role: string;
  salary: number;
  joiningDate: Date;
}

// Task Types
export interface Task {
  id: string;
  farmId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: string;
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
  assignedTo?: string;
  dueDate: Date;
  priority: TaskPriority;
}

// Feeding Log Types
export interface FeedingLog {
  id: string;
  animalId: string;
  date: Date;
  feedType: string;
  quantity: number;
  unit: string;
  notes?: string;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeedingLogDto {
  animalId: string;
  date: Date;
  feedType: string;
  quantity: number;
  unit: string;
  notes?: string;
}

// Delivery Log Types
export interface DeliveryLog {
  id: string;
  farmId: string;
  date: Date;
  quantity: number;
  destination: string;
  price: number;
  totalAmount: number;
  invoiceNumber?: string;
  status: DeliveryStatus;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface CreateDeliveryLogDto {
  farmId: string;
  date: Date;
  quantity: number;
  destination: string;
  price: number;
  invoiceNumber?: string;
  notes?: string;
}

// Vet Visit Types
export interface VetVisit {
  id: string;
  animalId: string;
  date: Date;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  prescriptions?: string;
  vetName: string;
  cost: number;
  nextVisitDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVetVisitDto {
  animalId: string;
  date: Date;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  prescriptions?: string;
  vetName: string;
  cost: number;
  nextVisitDate?: Date;
  notes?: string;
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
  isDeleted?: boolean;
  createdById: string;
  creator?: {
    name: string;
    email: string;
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
