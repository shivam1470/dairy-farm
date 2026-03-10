import { PartialType } from '@nestjs/swagger';
import { CreateVetVisitDto } from './create-vet-visit.dto';

export class UpdateVetVisitDto extends PartialType(CreateVetVisitDto) {}
