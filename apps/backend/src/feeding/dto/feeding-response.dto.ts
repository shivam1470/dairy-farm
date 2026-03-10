import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeedType, FeedingTime } from '@prisma/client';

export class FeedingLogDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  farmId: string;

  @ApiProperty()
  animalId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ enum: FeedingTime })
  feedingTime: FeedingTime;

  @ApiProperty({ enum: FeedType })
  feedType: FeedType;

  @ApiProperty()
  quantity: number;

  @ApiPropertyOptional()
  cost?: number | null;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty()
  recordedById: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
