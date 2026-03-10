import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ExpenseCategory, PaymentMethod } from '@prisma/client';

export class CreateExpenseDto {
  @ApiProperty({ example: 'farm_123' })
  @IsString()
  farmId: string;

  @ApiProperty({ enum: ExpenseCategory })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({ example: 'Cattle feed purchase' })
  @IsString()
  description: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'REC-2026-001' })
  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @ApiPropertyOptional({ example: 'Local Agro Store' })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiPropertyOptional({ example: 'Paid in cash' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'user_123' })
  @IsString()
  createdById: string;
}
