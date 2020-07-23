import { Module } from '@nestjs/common';
import { CEIController } from './cei.controller';
import { CEIService } from './cei.service';

@Module({
  providers: [CEIService],
  controllers: [CEIController],
})
export class CEIModule {
  constructor(){ }
}
