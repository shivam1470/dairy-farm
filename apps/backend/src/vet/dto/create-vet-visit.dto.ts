import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { VetVisitType, TreatmentType, VetVisitStatus } from '@prisma/client';

export class CreateVetVisitDto {
  @ApiProperty({ example: 'animal_123' })
  @IsString()
  animalId: string;

  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  visitDate: string;

  @ApiPropertyOptional({ enum: VetVisitType })
  @IsOptional()
  @IsEnum(VetVisitType)
  visitType?: VetVisitType;

  @ApiProperty({ example: 'Routine checkup' })
  @IsString()
  visitReason: string;

  @ApiPropertyOptional({ enum: TreatmentType })
  @IsOptional()
  @IsEnum(TreatmentType)
  treatmentType?: TreatmentType;

  @ApiPropertyOptional({ example: 'Mild fever' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'Administered medication' })
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiPropertyOptional({ example: 'Paracetamol 2 days' })
  @IsOptional()
  @IsString()
  prescription?: string;

  @ApiProperty({ example: 'Dr. Sharma' })
  @IsString()
  veterinarian: string;

  @ApiProperty({ example: 800 })
  @IsNumber()
  cost: number;

  @ApiProperty({ enum: VetVisitStatus })
  @IsEnum(VetVisitStatus)
  visitStatus: VetVisitStatus;

  @ApiPropertyOptional({ example: '2026-03-24' })
  @IsOptional()
  @IsDateString()
  nextVisitDate?: string;

  @ApiPropertyOptional({ example: 'Follow-up required' })
  @IsOptional()
  @IsString()
  notes?: string;
}
