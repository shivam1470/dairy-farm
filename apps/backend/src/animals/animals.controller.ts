import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AnimalsService } from './animals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { AnimalDto } from './dto/animal-response.dto';

@ApiTags('animals')
@Controller('animals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiCreatedResponse({ type: AnimalDto })
  create(@Req() req: Request, @Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(req.user as any, createAnimalDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: [AnimalDto] })
  findAll(@Req() req: Request) {
    return this.animalsService.findAll(req.user as any);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: AnimalDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.animalsService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: AnimalDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateAnimalDto: any) {
    return this.animalsService.update(req.user as any, id, updateAnimalDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: AnimalDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.animalsService.remove(req.user as any, id);
  }
}
