import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MilkRecordsService } from './milk-records.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('milk-records')
@UseGuards(JwtAuthGuard)
export class MilkRecordsController {
  constructor(private milkRecordsService: MilkRecordsService) {}

  @Post()
  create(@Body() createMilkRecordDto: any) {
    return this.milkRecordsService.create(createMilkRecordDto);
  }

  @Get()
  findAll(@Query('animalId') animalId?: string) {
    return this.milkRecordsService.findAll(animalId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.milkRecordsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMilkRecordDto: any) {
    return this.milkRecordsService.update(id, updateMilkRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.milkRecordsService.remove(id);
  }
}
