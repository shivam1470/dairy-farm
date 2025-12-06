import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { VetVisitType, TreatmentType, VetVisitStatus } from '@prisma/client';

export class CreateVetVisitDto {
  @IsString()
  animalId: string;

  @IsDateString()
  visitDate: string;

  @IsOptional()
  @IsEnum(VetVisitType)
  visitType?: VetVisitType;

  @IsString()
  visitReason: string;

  @IsOptional()
  @IsEnum(TreatmentType)
  treatmentType?: TreatmentType;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  treatment?: string;

  @IsOptional()
  @IsString()
  prescription?: string;

  @IsString()
  veterinarian: string;

  @IsNumber()
  cost: number;

  @IsEnum(VetVisitStatus)
  visitStatus: VetVisitStatus;

  @IsOptional()
  @IsDateString()
  nextVisitDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
