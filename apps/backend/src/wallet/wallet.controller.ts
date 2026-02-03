import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  getWallet(@Query('farmId') farmId: string) {
    return this.walletService.getWallet(farmId);
  }

  @Get('summary')
  getWalletWithTransactions(@Query('farmId') farmId: string) {
    return this.walletService.getWalletWithTransactions(farmId);
  }
}