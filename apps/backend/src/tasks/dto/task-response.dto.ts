import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class TaskAssigneeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class TaskDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  farmId: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiPropertyOptional()
  assignedToId?: string | null;

  @ApiPropertyOptional({ type: TaskAssigneeDto })
  assignedTo?: TaskAssigneeDto | null;

  @ApiProperty({ type: String, format: 'date-time' })
  dueDate: Date;

  @ApiProperty({ enum: TaskPriority })
  priority: TaskPriority;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty()
  createdById: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
