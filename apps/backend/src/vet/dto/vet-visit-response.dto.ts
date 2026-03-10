import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TreatmentType, VetVisitStatus, VetVisitType } from '@prisma/client';

export class VetVisitDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  animalId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  visitDate: Date;

  @ApiPropertyOptional({ enum: VetVisitType })
  visitType?: VetVisitType | null;

  @ApiProperty()
  visitReason: string;

  @ApiPropertyOptional({ enum: TreatmentType })
  treatmentType?: TreatmentType | null;

  @ApiPropertyOptional()
  diagnosis?: string | null;

  @ApiPropertyOptional()
  treatment?: string | null;

  @ApiPropertyOptional()
  prescription?: string | null;

  @ApiProperty()
  veterinarian: string;

  @ApiProperty()
  cost: number;

  @ApiProperty({ enum: VetVisitStatus })
  visitStatus: VetVisitStatus;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  nextVisitDate?: Date | null;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
