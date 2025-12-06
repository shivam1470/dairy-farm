import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ExpenseCategory, PaymentMethod } from '@prisma/client';

export class CreateExpenseDto {
  @IsString()
  farmId: string;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  createdById: string;
}
