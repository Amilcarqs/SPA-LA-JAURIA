import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuditAction } from './common/decorators/audit-action.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  @AuditAction({ action: 'Acceso dashboard', entityType: 'Request' })
  getHello(): string {
    return this.appService.getHello();
  }
}
