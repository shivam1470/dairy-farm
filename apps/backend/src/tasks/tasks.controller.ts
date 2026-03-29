import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task-response.dto';

@Controller('tasks')
@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiCreatedResponse({ type: TaskDto })
  create(@Req() req: Request, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user as any, createTaskDto);
  }

  @Get()
  @ApiOkResponse({ type: TaskDto, isArray: true })
  findAll(@Req() req: Request) {
    return this.tasksService.findAll(req.user as any);
  }

  @Get(':id')
  @ApiOkResponse({ type: TaskDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TaskDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(req.user as any, id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: TaskDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.tasksService.remove(req.user as any, id);
  }
}
