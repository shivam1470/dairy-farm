import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'farm_123' })
  @IsString()
  farmId: string;

  @ApiProperty({ example: 'Clean shed' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Clean and disinfect the main shed' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'worker_123' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiProperty({ example: '2026-03-12' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ enum: TaskPriority })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiPropertyOptional({ example: 'Use the new disinfectant' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'user_123' })
  @IsString()
  createdById: string;
}
