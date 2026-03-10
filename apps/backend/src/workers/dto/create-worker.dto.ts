import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { WorkerRole, WorkerShift, WorkerStatus } from '@prisma/client';

export class CreateWorkerDto {
  @ApiProperty({ example: 'farm_123' })
  @IsString()
  farmId: string;

  @ApiProperty({ example: 'Ravi Kumar' })
  @IsString()
  name: string;

  @ApiProperty({ example: '9999999999' })
  @IsString()
  contactNumber: string;

  @ApiPropertyOptional({ example: 'ravi@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'Village Road, District' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ enum: WorkerRole })
  @IsEnum(WorkerRole)
  role: WorkerRole;

  @ApiProperty({ enum: WorkerShift })
  @IsEnum(WorkerShift)
  shift: WorkerShift;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  salary: number;

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  joinDate: string;

  @ApiProperty({ enum: WorkerStatus })
  @IsEnum(WorkerStatus)
  status: WorkerStatus;

  @ApiPropertyOptional({ example: 'Good with cattle handling' })
  @IsOptional()
  @IsString()
  notes?: string;
}
