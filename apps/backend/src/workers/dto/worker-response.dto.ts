import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkerRole, WorkerShift, WorkerStatus } from '@prisma/client';

export class WorkerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  farmId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contactNumber: string;

  @ApiPropertyOptional()
  email?: string | null;

  @ApiPropertyOptional()
  address?: string | null;

  @ApiProperty({ enum: WorkerRole })
  role: WorkerRole;

  @ApiProperty({ enum: WorkerShift })
  shift: WorkerShift;

  @ApiProperty()
  salary: number;

  @ApiProperty({ type: String, format: 'date-time' })
  joinDate: Date;

  @ApiProperty({ enum: WorkerStatus })
  status: WorkerStatus;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
