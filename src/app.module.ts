import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CEIModule } from './cei/cei.module';

@Module({
  imports: [
    CEIModule,
  ],
  controllers: [
  ],
  providers: []
})
export class ApplicationModule {
  constructor() {}
}
