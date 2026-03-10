import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { DeliveryStatus, PaymentStatus } from '@prisma/client';

export class CreateDeliveryDto {
  @ApiProperty({ example: 'farm_123' })
  @IsString()
  farmId: string;

  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  deliveryDate: string;

  @ApiProperty({ example: 'Local Vendor' })
  @IsString()
  buyerName: string;

  @ApiPropertyOptional({ example: '9999999999' })
  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 45 })
  @IsNumber()
  pricePerLiter: number;

  @ApiProperty({ example: 2250 })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ enum: DeliveryStatus })
  @IsEnum(DeliveryStatus)
  deliveryStatus: DeliveryStatus;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiPropertyOptional({ example: 'Market road address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Delivered by worker A' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'user_123' })
  @IsString()
  createdById: string;
}
