import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryStatus, PaymentStatus } from '@prisma/client';

export class DeliveryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  farmId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  deliveryDate: Date;

  @ApiProperty()
  buyerName: string;

  @ApiPropertyOptional()
  buyerPhone?: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  pricePerLiter: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ enum: DeliveryStatus })
  deliveryStatus: DeliveryStatus;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiPropertyOptional()
  address?: string | null;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty()
  createdById: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
