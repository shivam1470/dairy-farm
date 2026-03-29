import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DevelopmentStatus } from '@prisma/client';

export class CreatePhaseDto {
  @ApiPropertyOptional({ example: 'farm_123', description: 'Derived from the authenticated user on the server.' })
  @IsOptional()
  @IsString()
  farmId?: string;

  @ApiProperty({ example: 'Shed Construction' })
  @IsString()
  phaseName: string;

  @ApiPropertyOptional({ example: 'Build a new cattle shed with proper ventilation' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  phaseOrder?: number;

  @ApiPropertyOptional({ enum: DevelopmentStatus, example: DevelopmentStatus.NOT_STARTED })
  @IsOptional()
  @IsEnum(DevelopmentStatus)
  status?: DevelopmentStatus;

  @ApiPropertyOptional({ example: 0, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ example: 250000 })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiPropertyOptional({ example: '2026-03-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-05-01' })
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional({ example: 'Contractor shortlisted' })
  @IsOptional()
  @IsString()
  notes?: string;
}
