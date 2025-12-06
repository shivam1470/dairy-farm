import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { MilkSession, MilkQuality } from '@prisma/client';

export class CreateMilkRecordDto {
  @IsString()
  animalId: string;

  @IsString()
  farmId: string;

  @IsDateString()
  date: string;

  @IsEnum(MilkSession)
  session: MilkSession;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  fatContent?: number;

  @IsOptional()
  @IsEnum(MilkQuality)
  quality?: MilkQuality;

  @IsOptional()
  @IsString()
  notes?: string;
}
