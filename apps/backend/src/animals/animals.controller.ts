import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AnimalsService } from './animals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAnimalDto } from './dto/create-animal.dto';

@Controller('animals')
@UseGuards(JwtAuthGuard)
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @Post()
  create(@Req() req: Request, @Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(req.user as any, createAnimalDto);
  }

  @Get()
  findAll(@Req() req: Request, @Query('farmId') farmId?: string) {
    return this.animalsService.findAll(req.user as any, farmId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnimalDto: any) {
    return this.animalsService.update(id, updateAnimalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animalsService.remove(id);
  }
}
