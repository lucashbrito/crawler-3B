import {Get, Param, Controller, Body, Post } from '@nestjs/common';
import { CEIService } from './cei.service';
import { WalletInterface } from './cei.interface';

import {
  ApiBearerAuth, ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('CEI')
@Controller('CEI')
export class CEIController {
  constructor(private readonly CEIService: CEIService) {}
  
  @Post('wallet')
  async getWallet(@Body() body): Promise<any> {
    return await this.CEIService.getWallet(body.cpf, body.password, body.date);
  }

  @Post('dividends')
  async dividends(@Body() body): Promise<any> {
    return await this.CEIService.getDividends(body.cpf, body.password);
  }

  @Post('stockHistory')
  async getStockHistory(@Body() body): Promise<any> {
    return await this.CEIService.getStockHistory(body.cpf, body.password, body.startDate, body.endDate);
  }
}
