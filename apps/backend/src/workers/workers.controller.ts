import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workers')
@UseGuards(JwtAuthGuard)
export class WorkersController {
  constructor(private workersService: WorkersService) {}

  @Post()
  create(@Body() createWorkerDto: any) {
    return this.workersService.create(createWorkerDto);
  }

  @Get()
  findAll(@Query('farmId') farmId: string) {
    return this.workersService.findAll(farmId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkerDto: any) {
    return this.workersService.update(id, updateWorkerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workersService.remove(id);
  }
}
