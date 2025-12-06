import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VetService } from './vet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vet')
@UseGuards(JwtAuthGuard)
export class VetController {
  constructor(private vetService: VetService) {}

  @Post()
  create(@Body() createVetVisitDto: any) {
    return this.vetService.create(createVetVisitDto);
  }

  @Get()
  findAll(@Query('animalId') animalId?: string) {
    return this.vetService.findAll(animalId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vetService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVetVisitDto: any) {
    return this.vetService.update(id, updateVetVisitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vetService.remove(id);
  }
}
