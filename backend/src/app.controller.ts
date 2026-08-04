import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from './common/decorators/allow-anonymous.decorator';

@Controller()
export class AppController {
  @Get('health')
  @AllowAnonymous()
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
