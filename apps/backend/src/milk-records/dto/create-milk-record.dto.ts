import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { MilkSession, MilkQuality } from '@prisma/client';

export class CreateMilkRecordDto {
  @ApiProperty({ example: 'animal_123' })
  @IsString()
  animalId: string;

  @ApiProperty({ example: 'farm_123' })
  @IsString()
  farmId: string;

  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: MilkSession })
  @IsEnum(MilkSession)
  session: MilkSession;

  @ApiProperty({ example: 8.5 })
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({ example: 4.2 })
  @IsOptional()
  @IsNumber()
  fatContent?: number;

  @ApiPropertyOptional({ enum: MilkQuality })
  @IsOptional()
  @IsEnum(MilkQuality)
  quality?: MilkQuality;

  @ApiPropertyOptional({ example: 'Good yield today' })
  @IsOptional()
  @IsString()
  notes?: string;
}
