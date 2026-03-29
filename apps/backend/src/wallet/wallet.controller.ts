import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('wallet')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getWallet(@Request() req) {
    return this.walletService.getWallet(req.user?.farmId);
  }

  @Get('summary')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getWalletWithTransactions(@Request() req) {
    return this.walletService.getWalletWithTransactions(req.user?.farmId);
  }
}
