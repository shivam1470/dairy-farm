import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MilestoneStatus } from '@prisma/client';

export class CreateMilestoneDto {
  @ApiProperty({ example: 'Lay foundation' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Complete the shed foundation work' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  milestoneOrder?: number;

  @ApiPropertyOptional({ enum: MilestoneStatus, example: MilestoneStatus.PENDING })
  @IsOptional()
  @IsEnum(MilestoneStatus)
  status?: MilestoneStatus;

  @ApiPropertyOptional({ example: '2026-03-20' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 'worker_123' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional({ example: 'Call vendor for cement delivery' })
  @IsOptional()
  @IsString()
  notes?: string;
}

