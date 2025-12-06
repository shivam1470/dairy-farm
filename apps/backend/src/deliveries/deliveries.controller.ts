import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('deliveries')
@UseGuards(JwtAuthGuard)
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) {}

  @Post()
  create(@Body() createDeliveryDto: any) {
    return this.deliveriesService.create(createDeliveryDto);
  }

  @Get()
  findAll(@Query('farmId') farmId: string) {
    return this.deliveriesService.findAll(farmId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeliveryDto: any) {
    return this.deliveriesService.update(id, updateDeliveryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveriesService.remove(id);
  }
}
