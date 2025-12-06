import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { WorkerRole, WorkerShift, WorkerStatus } from '@prisma/client';

export class CreateWorkerDto {
  @IsString()
  farmId: string;

  @IsString()
  name: string;

  @IsString()
  contactNumber: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsEnum(WorkerRole)
  role: WorkerRole;

  @IsEnum(WorkerShift)
  shift: WorkerShift;

  @IsNumber()
  salary: number;

  @IsDateString()
  joinDate: string;

  @IsEnum(WorkerStatus)
  status: WorkerStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
