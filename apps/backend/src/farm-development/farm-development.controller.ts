import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { FarmDevelopmentService } from './farm-development.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import {
  FarmDevelopmentMilestoneDto,
  FarmDevelopmentPhaseDto,
} from './dto/farm-development-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('farm-development')
@Controller('farm-development')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FarmDevelopmentController {
  constructor(
    private readonly farmDevelopmentService: FarmDevelopmentService,
  ) {}

  // Phase endpoints
  @Get('phases')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: [FarmDevelopmentPhaseDto] })
  getPhases(@Req() req: Request) {
    return this.farmDevelopmentService.getPhasesByFarm((req.user as any).farmId);
  }

  @Get('phases/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: FarmDevelopmentPhaseDto })
  getPhase(@Req() req: Request, @Param('id') id: string) {
    return this.farmDevelopmentService.getPhaseById((req.user as any).farmId, id);
  }

  @Post('phases')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiCreatedResponse({ type: FarmDevelopmentPhaseDto })
  createPhase(@Req() req: Request, @Body() createPhaseDto: CreatePhaseDto) {
    return this.farmDevelopmentService.createPhase((req.user as any), createPhaseDto);
  }

  @Patch('phases/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: FarmDevelopmentPhaseDto })
  updatePhase(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updatePhaseDto: UpdatePhaseDto,
  ) {
    return this.farmDevelopmentService.updatePhase((req.user as any).farmId, id, updatePhaseDto);
  }

  @Delete('phases/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: FarmDevelopmentPhaseDto })
  deletePhase(@Req() req: Request, @Param('id') id: string) {
    return this.farmDevelopmentService.deletePhase((req.user as any).farmId, id);
  }

  // Milestone endpoints
  @Get('phases/:phaseId/milestones')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: [FarmDevelopmentMilestoneDto] })
  getMilestones(@Req() req: Request, @Param('phaseId') phaseId: string) {
    return this.farmDevelopmentService.getMilestonesByPhase((req.user as any).farmId, phaseId);
  }

  @Get('milestones/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  @ApiOkResponse({ type: FarmDevelopmentMilestoneDto })
  getMilestone(@Req() req: Request, @Param('id') id: string) {
    return this.farmDevelopmentService.getMilestoneById((req.user as any).farmId, id);
  }

  @Post('phases/:phaseId/milestones')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiCreatedResponse({ type: FarmDevelopmentMilestoneDto })
  createMilestone(
    @Req() req: Request,
    @Param('phaseId') phaseId: string,
    @Body() createMilestoneDto: CreateMilestoneDto,
  ) {
    return this.farmDevelopmentService.createMilestone(
      (req.user as any).farmId,
      phaseId,
      createMilestoneDto,
    );
  }

  @Patch('milestones/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: FarmDevelopmentMilestoneDto })
  updateMilestone(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.farmDevelopmentService.updateMilestone((req.user as any).farmId, id, updateMilestoneDto);
  }

  @Patch('milestones/:id/complete')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: FarmDevelopmentMilestoneDto })
  completeMilestone(@Req() req: Request, @Param('id') id: string) {
    return this.farmDevelopmentService.completeMilestone((req.user as any).farmId, id);
  }

  @Delete('milestones/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: FarmDevelopmentMilestoneDto })
  deleteMilestone(@Req() req: Request, @Param('id') id: string) {
    return this.farmDevelopmentService.deleteMilestone((req.user as any).farmId, id);
  }

  // Progress and stats endpoints
  @Get('progress')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.WORKER, UserRole.VIEWER)
  getProgress(@Req() req: Request) {
    return this.farmDevelopmentService.getProgressStats((req.user as any).farmId);
  }
}
