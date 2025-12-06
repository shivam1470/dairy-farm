import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FeedingService } from './feeding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('feeding')
@UseGuards(JwtAuthGuard)
export class FeedingController {
  constructor(private feedingService: FeedingService) {}

  @Post()
  create(@Body() createFeedingDto: any) {
    return this.feedingService.create(createFeedingDto);
  }

  @Get()
  findAll(@Query('animalId') animalId?: string) {
    return this.feedingService.findAll(animalId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedingDto: any) {
    return this.feedingService.update(id, updateFeedingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedingService.remove(id);
  }
}
