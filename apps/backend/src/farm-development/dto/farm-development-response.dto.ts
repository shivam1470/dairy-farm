import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FarmDevelopmentStatus, MilestoneStatus } from '@prisma/client';

export class FarmDevelopmentPhaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  farmId: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiPropertyOptional()
  order?: number | null;

  @ApiProperty({ enum: FarmDevelopmentStatus })
  status: FarmDevelopmentStatus;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  startDate?: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  endDate?: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  targetDate?: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  completedAt?: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}

export class FarmDevelopmentMilestoneDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  farmId: string;

  @ApiProperty()
  phaseId: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiPropertyOptional()
  order?: number | null;

  @ApiProperty({ enum: MilestoneStatus })
  status: MilestoneStatus;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  dueDate?: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  completedAt?: Date | null;

  @ApiPropertyOptional()
  costEstimated?: number | null;

  @ApiPropertyOptional()
  costActual?: number | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
