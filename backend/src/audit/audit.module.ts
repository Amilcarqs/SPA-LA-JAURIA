import { Module, Global } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PrismaModule } from '../prisma/prisma.module'; // Asegúrate de importar tu PrismaModule

@Global() // Lo hacemos global para que pueda ser inyectado fácilmente
@Module({
  imports: [PrismaModule],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}