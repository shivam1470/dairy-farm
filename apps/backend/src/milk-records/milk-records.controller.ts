import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MilkRecordsService } from './milk-records.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMilkRecordDto } from './dto/create-milk-record.dto';
import { MilkRecordDto } from './dto/milk-record-response.dto';

@ApiTags('milk-records')
@Controller('milk-records')
@UseGuards(JwtAuthGuard)
export class MilkRecordsController {
  constructor(private milkRecordsService: MilkRecordsService) {}

  @Post()
  @ApiCreatedResponse({ type: MilkRecordDto })
  create(@Body() createMilkRecordDto: CreateMilkRecordDto) {
    return this.milkRecordsService.create(createMilkRecordDto);
  }

  @Get()
  @ApiOkResponse({ type: [MilkRecordDto] })
  findAll(@Query('animalId') animalId?: string) {
    return this.milkRecordsService.findAll(animalId);
  }

  @Get(':id')
  @ApiOkResponse({ type: MilkRecordDto })
  findOne(@Param('id') id: string) {
    return this.milkRecordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: MilkRecordDto })
  update(@Param('id') id: string, @Body() updateMilkRecordDto: any) {
    return this.milkRecordsService.update(id, updateMilkRecordDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: MilkRecordDto })
  remove(@Param('id') id: string) {
    return this.milkRecordsService.remove(id);
  }
}
