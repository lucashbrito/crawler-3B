import { Get, Controller } from '@nestjs/common';

@Controller("app")
export class AppController {
  @Get('get')
  root(): string {
    return 'Hello World!';
  }
}