import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { WorkersService } from './workers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { WorkerDto } from './dto/worker-response.dto';

@Controller('workers')
@ApiTags('workers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkersController {
  constructor(private workersService: WorkersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiCreatedResponse({ type: WorkerDto })
  create(@Req() req: Request, @Body() createWorkerDto: CreateWorkerDto) {
    return this.workersService.create(req.user as any, createWorkerDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: WorkerDto, isArray: true })
  findAll(@Req() req: Request) {
    return this.workersService.findAll(req.user as any);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: WorkerDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.workersService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: WorkerDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateWorkerDto: UpdateWorkerDto) {
    return this.workersService.update(req.user as any, id, updateWorkerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: WorkerDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.workersService.remove(req.user as any, id);
  }
}
