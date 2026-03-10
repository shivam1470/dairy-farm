import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DevelopmentStatus } from '@prisma/client';

export class UpdatePhaseDto {
  @ApiPropertyOptional({ example: 'Shed Construction' })
  @IsOptional()
  @IsString()
  phaseName?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  phaseOrder?: number;

  @ApiPropertyOptional({ enum: DevelopmentStatus, example: DevelopmentStatus.IN_PROGRESS })
  @IsOptional()
  @IsEnum(DevelopmentStatus)
  status?: DevelopmentStatus;

  @ApiPropertyOptional({ example: 25, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ example: 300000 })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsNumber()
  actualCost?: number;

  @ApiPropertyOptional({ example: '2026-03-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-05-01' })
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional({ example: '2026-04-15' })
  @IsOptional()
  @IsDateString()
  completedDate?: string;

  @ApiPropertyOptional({ example: 'Progress update notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

