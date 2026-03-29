import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
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
  create(@Req() req: Request, @Body() createMilkRecordDto: CreateMilkRecordDto) {
    return this.milkRecordsService.create(req.user as any, createMilkRecordDto);
  }

  @Get()
  @ApiOkResponse({ type: [MilkRecordDto] })
  findAll(@Req() req: Request, @Query('animalId') animalId?: string) {
    return this.milkRecordsService.findAll(req.user as any, animalId);
  }

  @Get(':id')
  @ApiOkResponse({ type: MilkRecordDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.milkRecordsService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: MilkRecordDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateMilkRecordDto: any) {
    return this.milkRecordsService.update(req.user as any, id, updateMilkRecordDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: MilkRecordDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.milkRecordsService.remove(req.user as any, id);
  }
}
