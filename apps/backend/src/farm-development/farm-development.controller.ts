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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FarmDevelopmentService } from './farm-development.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import {
  FarmDevelopmentMilestoneDto,
  FarmDevelopmentPhaseDto,
} from './dto/farm-development-response.dto';

@ApiTags('farm-development')
@Controller('farm-development')
export class FarmDevelopmentController {
  constructor(
    private readonly farmDevelopmentService: FarmDevelopmentService,
  ) {}

  // Phase endpoints
  @Get('phases')
  @ApiOkResponse({ type: [FarmDevelopmentPhaseDto] })
  getPhases(@Query('farmId') farmId: string) {
    return this.farmDevelopmentService.getPhasesByFarm(farmId);
  }

  @Get('phases/:id')
  @ApiOkResponse({ type: FarmDevelopmentPhaseDto })
  getPhase(@Param('id') id: string) {
    return this.farmDevelopmentService.getPhaseById(id);
  }

  @Post('phases')
  @ApiCreatedResponse({ type: FarmDevelopmentPhaseDto })
  createPhase(@Body() createPhaseDto: CreatePhaseDto) {
    return this.farmDevelopmentService.createPhase(createPhaseDto);
  }

  @Patch('phases/:id')
  @ApiOkResponse({ type: FarmDevelopmentPhaseDto })
  updatePhase(
    @Param('id') id: string,
    @Body() updatePhaseDto: UpdatePhaseDto,
  ) {
    return this.farmDevelopmentService.updatePhase(id, updatePhaseDto);
  }

  @Delete('phases/:id')
  @ApiOkResponse({ type: FarmDevelopmentPhaseDto })
  deletePhase(@Param('id') id: string) {
    return this.farmDevelopmentService.deletePhase(id);
  }

  // Milestone endpoints
  @Get('phases/:phaseId/milestones')
  @ApiOkResponse({ type: [FarmDevelopmentMilestoneDto] })
  getMilestones(@Param('phaseId') phaseId: string) {
    return this.farmDevelopmentService.getMilestonesByPhase(phaseId);
  }

  @Get('milestones/:id')
  @ApiOkResponse({ type: FarmDevelopmentMilestoneDto })
  getMilestone(@Param('id') id: string) {
    return this.farmDevelopmentService.getMilestoneById(id);
  }

  @Post('phases/:phaseId/milestones')
  @ApiCreatedResponse({ type: FarmDevelopmentMilestoneDto })
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
  @ApiOkResponse({ type: FarmDevelopmentMilestoneDto })
  updateMilestone(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.farmDevelopmentService.updateMilestone(id, updateMilestoneDto);
  }

  @Patch('milestones/:id/complete')
  @ApiOkResponse({ type: FarmDevelopmentMilestoneDto })
  completeMilestone(@Param('id') id: string) {
    return this.farmDevelopmentService.completeMilestone(id);
  }

  @Delete('milestones/:id')
  @ApiOkResponse({ type: FarmDevelopmentMilestoneDto })
  deleteMilestone(@Param('id') id: string) {
    return this.farmDevelopmentService.deleteMilestone(id);
  }

  // Progress and stats endpoints
  @Get('progress')
  getProgress(@Query('farmId') farmId: string) {
    return this.farmDevelopmentService.getProgressStats(farmId);
  }
}

