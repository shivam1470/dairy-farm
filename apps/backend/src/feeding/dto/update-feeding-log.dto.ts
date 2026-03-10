import { PartialType } from '@nestjs/swagger';
import { CreateFeedingLogDto } from './create-feeding-log.dto';

export class UpdateFeedingLogDto extends PartialType(CreateFeedingLogDto) {}
