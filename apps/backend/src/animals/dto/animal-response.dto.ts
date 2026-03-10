import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AnimalAcquisitionType,
  AnimalGender,
  AnimalStatus,
  AnimalType,
  LifeStage,
} from '@prisma/client';

export class AnimalDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tagNumber: string;

  @ApiPropertyOptional()
  name?: string | null;

  @ApiProperty()
  breed: string;

  @ApiProperty({ type: String, format: 'date-time' })
  dateOfBirth: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  timeOfBirth?: Date | null;

  @ApiProperty({ enum: AnimalGender })
  gender: AnimalGender;

  @ApiProperty({ enum: AnimalType })
  type: AnimalType;

  @ApiProperty({ enum: LifeStage })
  lifeStage: LifeStage;

  @ApiProperty({ enum: AnimalStatus })
  status: AnimalStatus;

  @ApiProperty({ enum: AnimalAcquisitionType })
  acquisitionType: AnimalAcquisitionType;

  @ApiProperty()
  farmId: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  purchaseDate?: Date | null;

  @ApiPropertyOptional()
  purchasePrice?: number | null;

  @ApiPropertyOptional()
  purchaseFromName?: string | null;

  @ApiPropertyOptional()
  purchaseFromMobile?: string | null;

  @ApiPropertyOptional()
  purchaseFromEmail?: string | null;

  @ApiPropertyOptional()
  currentWeight?: number | null;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
