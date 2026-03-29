import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { VetService } from './vet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVetVisitDto } from './dto/create-vet-visit.dto';
import { UpdateVetVisitDto } from './dto/update-vet-visit.dto';
import { VetVisitDto } from './dto/vet-visit-response.dto';

@Controller('vet')
@UseGuards(JwtAuthGuard)
@ApiTags('vet')
export class VetController {
  constructor(private vetService: VetService) {}

  @Post()
  @ApiCreatedResponse({ type: VetVisitDto })
  create(@Req() req: Request, @Body() createVetVisitDto: CreateVetVisitDto) {
    return this.vetService.create(req.user as any, createVetVisitDto);
  }

  @Get()
  @ApiOkResponse({ type: [VetVisitDto] })
  findAll(@Req() req: Request, @Query('animalId') animalId?: string) {
    return this.vetService.findAll(req.user as any, animalId);
  }

  @Get(':id')
  @ApiOkResponse({ type: VetVisitDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.vetService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: VetVisitDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateVetVisitDto: UpdateVetVisitDto) {
    return this.vetService.update(req.user as any, id, updateVetVisitDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: VetVisitDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.vetService.remove(req.user as any, id);
  }
}
