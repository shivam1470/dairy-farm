import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { DeliveryStatus, PaymentStatus } from '@prisma/client';

export class CreateDeliveryDto {
  @IsString()
  farmId: string;

  @IsDateString()
  deliveryDate: string;

  @IsString()
  buyerName: string;

  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  pricePerLiter: number;

  @IsNumber()
  totalAmount: number;

  @IsEnum(DeliveryStatus)
  deliveryStatus: DeliveryStatus;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  createdById: string;
}
