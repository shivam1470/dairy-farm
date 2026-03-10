import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/create-payment.dto';
import { PaymentDto } from './dto/payment-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  // eslint-disable-next-line no-unused-vars
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @ApiCreatedResponse({ type: PaymentDto })
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.create(createPaymentDto, req.user.id);
  }

  @Get()
  @ApiOkResponse({ type: [PaymentDto] })
  findAll(@Query('farmId') farmId: string) {
    return this.paymentsService.findAll(farmId);
  }

  @Get('income')
  @ApiOkResponse({ type: [PaymentDto] })
  findIncome(@Query('farmId') farmId: string) {
    return this.paymentsService.findIncome(farmId);
  }

  @Get('expenses')
  @ApiOkResponse({ type: [PaymentDto] })
  findExpenses(@Query('farmId') farmId: string) {
    return this.paymentsService.findExpenses(farmId);
  }

  @Get(':id')
  @ApiOkResponse({ type: PaymentDto })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: PaymentDto })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: PaymentDto })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}