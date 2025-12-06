import { Module } from '@nestjs/common';
import { MilkRecordsController } from './milk-records.controller';
import { MilkRecordsService } from './milk-records.service';

@Module({
  controllers: [MilkRecordsController],
  providers: [MilkRecordsService],
})
export class MilkRecordsModule {}
