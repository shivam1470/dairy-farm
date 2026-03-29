import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
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
  create(@Req() req: Request, @Body() createFeedingDto: CreateFeedingLogDto) {
    return this.feedingService.create(req.user as any, createFeedingDto);
  }

  @Get()
  @ApiOkResponse({ type: [FeedingLogDto] })
  findAll(@Req() req: Request, @Query('animalId') animalId?: string) {
    return this.feedingService.findAll(req.user as any, animalId);
  }

  @Get(':id')
  @ApiOkResponse({ type: FeedingLogDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.feedingService.findOne(req.user as any, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: FeedingLogDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateFeedingDto: UpdateFeedingLogDto) {
    return this.feedingService.update(req.user as any, id, updateFeedingDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: FeedingLogDto })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.feedingService.remove(req.user as any, id);
  }
}
