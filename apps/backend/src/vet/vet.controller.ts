import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
  create(@Body() createVetVisitDto: CreateVetVisitDto) {
    return this.vetService.create(createVetVisitDto);
  }

  @Get()
  @ApiOkResponse({ type: [VetVisitDto] })
  findAll(@Query('animalId') animalId?: string) {
    return this.vetService.findAll(animalId);
  }

  @Get(':id')
  @ApiOkResponse({ type: VetVisitDto })
  findOne(@Param('id') id: string) {
    return this.vetService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: VetVisitDto })
  update(@Param('id') id: string, @Body() updateVetVisitDto: UpdateVetVisitDto) {
    return this.vetService.update(id, updateVetVisitDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: VetVisitDto })
  remove(@Param('id') id: string) {
    return this.vetService.remove(id);
  }
}
