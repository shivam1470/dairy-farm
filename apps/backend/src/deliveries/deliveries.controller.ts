import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { DeliveriesService } from './deliveries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliveryDto } from './dto/delivery-response.dto';

@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('deliveries')
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  @ApiCreatedResponse({ type: DeliveryDto })
  create(@Req() req: Request, @Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveriesService.create(req.user as any, createDeliveryDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: [DeliveryDto] })
  findAll(@Req() req: Request) {
    return this.deliveriesService.findAll(req.user as any);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: DeliveryDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.deliveriesService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER)
  @ApiOkResponse({ type: DeliveryDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveriesService.update(req.user as any, id, updateDeliveryDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: DeliveryDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.deliveriesService.remove(req.user as any, id);
  }
}
