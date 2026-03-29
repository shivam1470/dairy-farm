import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task-response.dto';

@Controller('tasks')
@ApiTags('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiCreatedResponse({ type: TaskDto })
  create(@Req() req: Request, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user as any, createTaskDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: TaskDto, isArray: true })
  findAll(@Req() req: Request) {
    return this.tasksService.findAll(req.user as any);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: TaskDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  @ApiOkResponse({ type: TaskDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(req.user as any, id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: TaskDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.remove(req.user as any, id);
  }
}
