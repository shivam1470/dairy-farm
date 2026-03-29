import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/create-payment.dto';
import { DeletePaymentResponseDto, PaymentDto } from './dto/payment-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  // eslint-disable-next-line no-unused-vars
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiCreatedResponse({ type: PaymentDto })
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.create(req.user, createPaymentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: [PaymentDto] })
  findAll(@Request() req) {
    return this.paymentsService.findAll(req.user);
  }

  @Get('income')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: [PaymentDto] })
  findIncome(@Request() req) {
    return this.paymentsService.findIncome(req.user);
  }

  @Get('expenses')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: [PaymentDto] })
  findExpenses(@Request() req) {
    return this.paymentsService.findExpenses(req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: PaymentDto })
  findOne(@Request() req, @Param('id') id: string) {
    return this.paymentsService.findOne(req.user, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: PaymentDto })
  update(@Request() req, @Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(req.user, id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOkResponse({ type: DeletePaymentResponseDto })
  remove(@Request() req, @Param('id') id: string) {
    return this.paymentsService.remove(req.user, id);
  }
}
