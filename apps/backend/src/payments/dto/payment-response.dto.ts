import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PaymentCategory,
  PaymentMethod,
  PaymentType,
  ReferenceType,
} from '@prisma/client';

export class PaymentCreatorDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class PaymentFarmDto {
  @ApiProperty()
  name: string;
}

export class PaymentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  farmId: string;

  @ApiProperty({ enum: PaymentType })
  type: PaymentType;

  @ApiProperty({ enum: PaymentCategory })
  category: PaymentCategory;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  transactionDate: Date;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ nullable: true })
  referenceId?: string | null;

  @ApiPropertyOptional({ enum: ReferenceType, nullable: true })
  referenceType?: ReferenceType | null;

  @ApiPropertyOptional({ nullable: true })
  notes?: string | null;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  createdById: string;

  @ApiPropertyOptional({ type: PaymentCreatorDto })
  creator?: PaymentCreatorDto;

  @ApiPropertyOptional({ type: PaymentFarmDto })
  farm?: PaymentFarmDto;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}

export class DeletePaymentResponseDto {
  @ApiProperty()
  message: string;
}
