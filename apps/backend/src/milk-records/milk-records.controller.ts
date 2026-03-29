import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { MilkRecordsService } from './milk-records.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateMilkRecordDto } from './dto/create-milk-record.dto';
import { MilkRecordDto } from './dto/milk-record-response.dto';

@ApiTags('milk-records')
@Controller('milk-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MilkRecordsController {
  constructor(private milkRecordsService: MilkRecordsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  @ApiCreatedResponse({ type: MilkRecordDto })
  create(@Req() req: Request, @Body() createMilkRecordDto: CreateMilkRecordDto) {
    return this.milkRecordsService.create(req.user as any, createMilkRecordDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: [MilkRecordDto] })
  findAll(@Req() req: Request, @Query('animalId') animalId?: string) {
    return this.milkRecordsService.findAll(req.user as any, animalId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: MilkRecordDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.milkRecordsService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  @ApiOkResponse({ type: MilkRecordDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateMilkRecordDto: any) {
    return this.milkRecordsService.update(req.user as any, id, updateMilkRecordDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: MilkRecordDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.milkRecordsService.remove(req.user as any, id);
  }
}
