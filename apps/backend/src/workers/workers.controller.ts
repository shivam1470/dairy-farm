import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { WorkersService } from './workers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { WorkerDto } from './dto/worker-response.dto';

@Controller('workers')
@ApiTags('workers')
@UseGuards(JwtAuthGuard)
export class WorkersController {
  constructor(private workersService: WorkersService) {}

  @Post()
  @ApiCreatedResponse({ type: WorkerDto })
  create(@Req() req: Request, @Body() createWorkerDto: CreateWorkerDto) {
    return this.workersService.create(req.user as any, createWorkerDto);
  }

  @Get()
  @ApiOkResponse({ type: WorkerDto, isArray: true })
  findAll(@Req() req: Request) {
    return this.workersService.findAll(req.user as any);
  }

  @Get(':id')
  @ApiOkResponse({ type: WorkerDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.workersService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: WorkerDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateWorkerDto: UpdateWorkerDto) {
    return this.workersService.update(req.user as any, id, updateWorkerDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: WorkerDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.workersService.remove(req.user as any, id);
  }
}
