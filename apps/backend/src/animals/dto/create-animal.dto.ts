import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional, IsNumber, IsEmail } from 'class-validator';
import { AnimalStatus, AnimalGender, AnimalAcquisitionType, AnimalType, LifeStage } from '@prisma/client';

// dto for animal by shivam mishra
export class CreateAnimalDto {
  @ApiProperty({ example: 'A-001' })
  @IsString()
  tagNumber: string;

  @ApiPropertyOptional({ example: 'Gauri' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Holstein' })
  @IsString()
  breed: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  dateOfBirth: string;

  @ApiPropertyOptional({ example: '09:30' })
  @IsOptional()
  @IsDateString()
  timeOfBirth?: string;

  @ApiProperty({ enum: AnimalGender, example: AnimalGender.FEMALE })
  @IsEnum(AnimalGender)
  gender: AnimalGender;

  @ApiProperty({ enum: AnimalType, example: AnimalType.COW })
  @IsEnum(AnimalType)
  type: AnimalType;

  @ApiProperty({ enum: LifeStage, example: LifeStage.ADULT })
  @IsEnum(LifeStage)
  lifeStage: LifeStage;

  @ApiProperty({ enum: AnimalStatus, example: AnimalStatus.ACTIVE })
  @IsEnum(AnimalStatus)
  status: AnimalStatus;

  @ApiProperty({
    enum: AnimalAcquisitionType,
    example: AnimalAcquisitionType.BORN,
    description: 'How the animal was acquired (born, purchased, etc).',
  })
  @IsEnum(AnimalAcquisitionType)
  acquisitionType: AnimalAcquisitionType;

  @ApiPropertyOptional({ example: 'farm_123' })
  @IsOptional()
  @IsString()
  farmId?: string;

  @ApiPropertyOptional({ example: '2025-02-15', description: 'Required when acquisitionType is PURCHASED' })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiPropertyOptional({ example: 45000 })
  @IsOptional()
  @IsNumber()
  purchasePrice?: number;

  @ApiPropertyOptional({ example: 'Ramesh Dairy' })
  @IsOptional()
  @IsString()
  purchaseFromName?: string;

  @ApiPropertyOptional({ example: '9999999999' })
  @IsOptional()
  @IsString()
  purchaseFromMobile?: string;

  @ApiPropertyOptional({ example: 'seller@example.com' })
  @IsOptional()
  @IsEmail()
  purchaseFromEmail?: string;

  @ApiPropertyOptional({ example: 350 })
  @IsOptional()
  @IsNumber()
  currentWeight?: number;

  @ApiPropertyOptional({ example: 'Healthy and vaccinated' })
  @IsOptional()
  @IsString()
  notes?: string;
}
