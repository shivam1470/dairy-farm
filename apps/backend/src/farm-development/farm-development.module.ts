import { Module } from '@nestjs/common';
import { FarmDevelopmentService } from './farm-development.service';
import { FarmDevelopmentController } from './farm-development.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FarmDevelopmentController],
  providers: [FarmDevelopmentService],
  exports: [FarmDevelopmentService],
})
export class FarmDevelopmentModule {}

