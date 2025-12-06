import { Module } from '@nestjs/common';
import { VetController } from './vet.controller';
import { VetService } from './vet.service';

@Module({
  controllers: [VetController],
  providers: [VetService],
})
export class VetModule {}
