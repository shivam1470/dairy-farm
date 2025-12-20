import { IsString, IsDateString, IsEnum, IsOptional, IsNumber, IsEmail } from 'class-validator';
import { AnimalStatus, AnimalGender, AnimalAcquisitionType, AnimalType, LifeStage } from '@prisma/client';

// dto for animal by shivam mishra
export class CreateAnimalDto {
  @IsString()
  tagNumber: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  breed: string;

  @IsDateString()
  dateOfBirth: string;

  @IsOptional()
  @IsDateString()
  timeOfBirth?: string;

  @IsEnum(AnimalGender)
  gender: AnimalGender;

  @IsEnum(AnimalType)
  type: AnimalType;

  @IsEnum(LifeStage)
  lifeStage: LifeStage;

  @IsEnum(AnimalStatus)
  status: AnimalStatus;

  @IsEnum(AnimalAcquisitionType)
  acquisitionType: AnimalAcquisitionType;

  @IsString()
  farmId: string;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsNumber()
  purchasePrice?: number;

  @IsOptional()
  @IsString()
  purchaseFromName?: string;

  @IsOptional()
  @IsString()
  purchaseFromMobile?: string;

  @IsOptional()
  @IsEmail()
  purchaseFromEmail?: string;

  @IsOptional()
  @IsNumber()
  currentWeight?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
