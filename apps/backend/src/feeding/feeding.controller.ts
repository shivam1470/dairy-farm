import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FeedingService } from './feeding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFeedingLogDto } from './dto/create-feeding-log.dto';
import { UpdateFeedingLogDto } from './dto/update-feeding-log.dto';
import { FeedingLogDto } from './dto/feeding-response.dto';

@Controller('feeding')
@UseGuards(JwtAuthGuard)
@ApiTags('feeding')
export class FeedingController {
  constructor(private feedingService: FeedingService) {}

  @Post()
  @ApiCreatedResponse({ type: FeedingLogDto })
  create(@Body() createFeedingDto: CreateFeedingLogDto) {
    return this.feedingService.create(createFeedingDto);
  }

  @Get()
  @ApiOkResponse({ type: [FeedingLogDto] })
  findAll(@Query('animalId') animalId?: string) {
    return this.feedingService.findAll(animalId);
  }

  @Get(':id')
  @ApiOkResponse({ type: FeedingLogDto })
  findOne(@Param('id') id: string) {
    return this.feedingService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: FeedingLogDto })
  update(@Param('id') id: string, @Body() updateFeedingDto: UpdateFeedingLogDto) {
    return this.feedingService.update(id, updateFeedingDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: FeedingLogDto })
  remove(@Param('id') id: string) {
    return this.feedingService.remove(id);
  }
}
