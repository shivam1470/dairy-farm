import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ enum: PaymentType, example: PaymentType.INCOME })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({ enum: PaymentCategory, example: PaymentCategory.MILK_SALES })
  @IsEnum(PaymentCategory)
  category: PaymentCategory;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Milk sale to local vendor' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  date: string; // When entry was added

  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  transactionDate: string; // When money actually moved

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 'farm_123' })
  @IsString()
  farmId: string;

  @ApiPropertyOptional({ example: 'expense_123' })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional({ enum: ReferenceType, example: ReferenceType.OTHER })
  @IsOptional()
  @IsEnum(ReferenceType)
  referenceType?: ReferenceType;

  @ApiPropertyOptional({ example: 'Paid in cash at office' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePaymentDto {
  @ApiPropertyOptional({ enum: PaymentType, example: PaymentType.EXPENSE })
  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;

  @ApiPropertyOptional({ enum: PaymentCategory, example: PaymentCategory.FEED })
  @IsOptional()
  @IsEnum(PaymentCategory)
  category?: PaymentCategory;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2026-03-10' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: '2026-03-10' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiPropertyOptional({ enum: PaymentMethod, example: PaymentMethod.UPI })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ example: 'expense_123' })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional({ enum: ReferenceType, example: ReferenceType.EXPENSE })
  @IsOptional()
  @IsEnum(ReferenceType)
  referenceType?: ReferenceType;

  @ApiPropertyOptional({ example: 'Updated notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  isDeleted?: boolean;
}