import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { FeedingTime, FeedType } from '@prisma/client';

export class CreateFeedingLogDto {
  @IsString()
  farmId: string;

  @IsString()
  animalId: string;

  @IsDateString()
  date: string;

  @IsEnum(FeedingTime)
  feedingTime: FeedingTime;

  @IsEnum(FeedType)
  feedType: FeedType;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  recordedById: string;
}
