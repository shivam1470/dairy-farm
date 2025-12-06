import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { AnimalCategory, AnimalStatus, AnimalGender } from '@prisma/client';

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

  @IsEnum(AnimalGender)
  gender: AnimalGender;

  @IsEnum(AnimalCategory)
  category: AnimalCategory;

  @IsEnum(AnimalStatus)
  status: AnimalStatus;

  @IsString()
  farmId: string;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsNumber()
  purchasePrice?: number;

  @IsOptional()
  @IsNumber()
  currentWeight?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
