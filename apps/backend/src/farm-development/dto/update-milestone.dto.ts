import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MilestoneStatus } from '@prisma/client';

export class UpdateMilestoneDto {
  @ApiPropertyOptional({ example: 'Lay foundation' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Milestone details updated' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  milestoneOrder?: number;

  @ApiPropertyOptional({ enum: MilestoneStatus, example: MilestoneStatus.COMPLETED })
  @IsOptional()
  @IsEnum(MilestoneStatus)
  status?: MilestoneStatus;

  @ApiPropertyOptional({ example: '2026-03-20' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: '2026-03-18' })
  @IsOptional()
  @IsDateString()
  completedDate?: string;

  @ApiPropertyOptional({ example: 'worker_123' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional({ example: 'Notes for the milestone' })
  @IsOptional()
  @IsString()
  notes?: string;
}

