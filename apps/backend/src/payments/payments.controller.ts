import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
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
    return this.paymentsService.create(req.user, createPaymentDto);
  }

  @Get()
  @ApiOkResponse({ type: [PaymentDto] })
  findAll(@Request() req) {
    return this.paymentsService.findAll(req.user);
  }

  @Get('income')
  @ApiOkResponse({ type: [PaymentDto] })
  findIncome(@Request() req) {
    return this.paymentsService.findIncome(req.user);
  }

  @Get('expenses')
  @ApiOkResponse({ type: [PaymentDto] })
  findExpenses(@Request() req) {
    return this.paymentsService.findExpenses(req.user);
  }

  @Get(':id')
  @ApiOkResponse({ type: PaymentDto })
  findOne(@Request() req, @Param('id') id: string) {
    return this.paymentsService.findOne(req.user, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: PaymentDto })
  update(@Request() req, @Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(req.user, id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: PaymentDto })
  remove(@Request() req, @Param('id') id: string) {
    return this.paymentsService.remove(req.user, id);
  }
}
