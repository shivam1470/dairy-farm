import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  getWallet(@Request() req) {
    return this.walletService.getWallet(req.user?.farmId);
  }

  @Get('summary')
  getWalletWithTransactions(@Request() req) {
    return this.walletService.getWalletWithTransactions(req.user?.farmId);
  }
}
