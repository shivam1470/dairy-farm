import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DeliveriesService } from './deliveries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliveryDto } from './dto/delivery-response.dto';

@Controller('deliveries')
@UseGuards(JwtAuthGuard)
@ApiTags('deliveries')
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) {}

  @Post()
  @ApiCreatedResponse({ type: DeliveryDto })
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveriesService.create(createDeliveryDto);
  }

  @Get()
  @ApiOkResponse({ type: [DeliveryDto] })
  findAll(@Query('farmId') farmId: string) {
    return this.deliveriesService.findAll(farmId);
  }

  @Get(':id')
  @ApiOkResponse({ type: DeliveryDto })
  findOne(@Param('id') id: string) {
    return this.deliveriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: DeliveryDto })
  update(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveriesService.update(id, updateDeliveryDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeliveryDto })
  remove(@Param('id') id: string) {
    return this.deliveriesService.remove(id);
  }
}
