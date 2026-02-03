import { IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum PaymentType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
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
  OTHER_EXPENSE = 'OTHER_EXPENSE'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE'
}

export enum ReferenceType {
  EXPENSE = 'EXPENSE',
  DELIVERY = 'DELIVERY',
  VET_VISIT = 'VET_VISIT',
  FEEDING_LOG = 'FEEDING_LOG',
  OTHER = 'OTHER'
}

export class CreatePaymentDto {
  @IsEnum(PaymentType)
  type: PaymentType;

  @IsEnum(PaymentCategory)
  category: PaymentCategory;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsDateString()
  date: string; // When entry was added

  @IsDateString()
  transactionDate: string; // When money actually moved

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  farmId: string;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsEnum(ReferenceType)
  referenceType?: ReferenceType;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;

  @IsOptional()
  @IsEnum(PaymentCategory)
  category?: PaymentCategory;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsEnum(ReferenceType)
  referenceType?: ReferenceType;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  isDeleted?: boolean;
}