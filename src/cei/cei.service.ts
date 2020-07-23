import { Injectable } from '@nestjs/common';
import CeiCrawler = require('./crawler/CeiCrawler');
const moment = require('moment')

@Injectable()
export class CEIService {
  constructor() {}

  async getWallet(cpf: any, password: any, date: any): Promise<any> {
    try
    {
      const ceiCrawler = new CeiCrawler(cpf, password);
      return await ceiCrawler.getWallet(new Date(date));
    }
    catch(ex)
    {
      return `${ex}`;
    }
  }

  async getDividends(cpf: any, password: any): Promise<any> {
    try
    {
      const ceiCrawler = new CeiCrawler(cpf, password);
      return await ceiCrawler.getDividends();
    }
    catch(ex)
    {
      return `${ex}`;
    }
  }

  async getStockHistory(cpf: any, password: any, startDate: any, endDate: any): Promise<any> {
    try
    {
      const ceiCrawler = new CeiCrawler(cpf, password);
      return await ceiCrawler.getStockHistory(new Date(startDate), new Date(endDate));
    }
    catch(ex)
    {
      return `${ex}`;
    }
  }
}
