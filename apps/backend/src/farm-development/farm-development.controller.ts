import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FarmDevelopmentService } from './farm-development.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Controller('farm-development')
export class FarmDevelopmentController {
  constructor(
    private readonly farmDevelopmentService: FarmDevelopmentService,
  ) {}

  // Phase endpoints
  @Get('phases')
  getPhases(@Query('farmId') farmId: string) {
    return this.farmDevelopmentService.getPhasesByFarm(farmId);
  }

  @Get('phases/:id')
  getPhase(@Param('id') id: string) {
    return this.farmDevelopmentService.getPhaseById(id);
  }

  @Post('phases')
  createPhase(@Body() createPhaseDto: CreatePhaseDto) {
    return this.farmDevelopmentService.createPhase(createPhaseDto);
  }

  @Patch('phases/:id')
  updatePhase(
    @Param('id') id: string,
    @Body() updatePhaseDto: UpdatePhaseDto,
  ) {
    return this.farmDevelopmentService.updatePhase(id, updatePhaseDto);
  }

  @Delete('phases/:id')
  deletePhase(@Param('id') id: string) {
    return this.farmDevelopmentService.deletePhase(id);
  }

  // Milestone endpoints
  @Get('phases/:phaseId/milestones')
  getMilestones(@Param('phaseId') phaseId: string) {
    return this.farmDevelopmentService.getMilestonesByPhase(phaseId);
  }

  @Get('milestones/:id')
  getMilestone(@Param('id') id: string) {
    return this.farmDevelopmentService.getMilestoneById(id);
  }

  @Post('phases/:phaseId/milestones')
  createMilestone(
    @Param('phaseId') phaseId: string,
    @Body() createMilestoneDto: CreateMilestoneDto,
  ) {
    return this.farmDevelopmentService.createMilestone(
      phaseId,
      createMilestoneDto,
    );
  }

  @Patch('milestones/:id')
  updateMilestone(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.farmDevelopmentService.updateMilestone(id, updateMilestoneDto);
  }

  @Patch('milestones/:id/complete')
  completeMilestone(@Param('id') id: string) {
    return this.farmDevelopmentService.completeMilestone(id);
  }

  @Delete('milestones/:id')
  deleteMilestone(@Param('id') id: string) {
    return this.farmDevelopmentService.deleteMilestone(id);
  }

  // Progress and stats endpoints
  @Get('progress')
  getProgress(@Query('farmId') farmId: string) {
    return this.farmDevelopmentService.getProgressStats(farmId);
  }
}

