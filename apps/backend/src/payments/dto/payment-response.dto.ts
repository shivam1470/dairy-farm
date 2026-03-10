import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus, PaymentType } from '@prisma/client';

export class PaymentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  farmId: string;

  @ApiProperty({ enum: PaymentType })
  type: PaymentType;

  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  amount: number;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  date?: Date | null;

  @ApiPropertyOptional()
  reference?: string | null;

  @ApiPropertyOptional()
  payerName?: string | null;

  @ApiPropertyOptional()
  payerMobile?: string | null;

  @ApiPropertyOptional()
  payerEmail?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
