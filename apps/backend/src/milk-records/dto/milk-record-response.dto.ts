import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MilkQuality, MilkSession } from '@prisma/client';

export class MilkRecordDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  farmId: string;

  @ApiProperty()
  animalId: string;

  // Prisma stores DateTime; API typically returns ISO string.
  @ApiProperty({ type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ enum: MilkSession })
  session: MilkSession;

  @ApiProperty()
  quantity: number;

  @ApiPropertyOptional()
  fatContent?: number | null;

  @ApiPropertyOptional({ enum: MilkQuality })
  quality?: MilkQuality | null;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
