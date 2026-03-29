import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AnimalsService } from './animals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { AnimalDto } from './dto/animal-response.dto';

@ApiTags('animals')
@Controller('animals')
@UseGuards(JwtAuthGuard)
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @Post()
  @ApiCreatedResponse({ type: AnimalDto })
  create(@Req() req: Request, @Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(req.user as any, createAnimalDto);
  }

  @Get()
  @ApiOkResponse({ type: [AnimalDto] })
  findAll(@Req() req: Request) {
    return this.animalsService.findAll(req.user as any);
  }

  @Get(':id')
  @ApiOkResponse({ type: AnimalDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.animalsService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: AnimalDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateAnimalDto: any) {
    return this.animalsService.update(req.user as any, id, updateAnimalDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: AnimalDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.animalsService.remove(req.user as any, id);
  }
}
