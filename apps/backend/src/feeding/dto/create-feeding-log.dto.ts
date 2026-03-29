import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { FeedingTime, FeedType } from '@prisma/client';

export class CreateFeedingLogDto {
  @ApiPropertyOptional({ example: 'farm_123', description: 'Derived from the authenticated user on the server.' })
  @IsOptional()
  @IsString()
  farmId?: string;

  @ApiProperty({ example: 'animal_123' })
  @IsString()
  animalId: string;

  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: FeedingTime })
  @IsEnum(FeedingTime)
  feedingTime: FeedingTime;

  @ApiProperty({ enum: FeedType })
  @IsEnum(FeedType)
  feedType: FeedType;

  @ApiProperty({ example: 5 })
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional({ example: 'Added supplements' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'user_123', description: 'Derived from the authenticated user on the server.' })
  @IsOptional()
  @IsString()
  recordedById?: string;
}
