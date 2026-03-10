import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
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
  create(@Body() createWorkerDto: CreateWorkerDto) {
    return this.workersService.create(createWorkerDto);
  }

  @Get()
  @ApiOkResponse({ type: WorkerDto, isArray: true })
  findAll(@Query('farmId') farmId: string) {
    return this.workersService.findAll(farmId);
  }

  @Get(':id')
  @ApiOkResponse({ type: WorkerDto })
  findOne(@Param('id') id: string) {
    return this.workersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: WorkerDto })
  update(@Param('id') id: string, @Body() updateWorkerDto: UpdateWorkerDto) {
    return this.workersService.update(id, updateWorkerDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: WorkerDto })
  remove(@Param('id') id: string) {
    return this.workersService.remove(id);
  }
}
