import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditService } from '../../audit/audit.service';
import { AUDIT_KEY, AuditOptions } from '../decorators/audit-action.decorators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    
    // Obtener la metadata del decorador @AuditAction
    const auditOptions = this.reflector.get<AuditOptions>(
      AUDIT_KEY,
      context.getHandler(),
    );

    // Si el endpoint no tiene el decorador, ignoramos la auditoría de este request
    if (!auditOptions) {
      return next.handle();
    }

    const { ip, headers, user, body, params } = request;
    const userAgent = headers['user-agent'];
    // Manejo de IPs detrás de proxies (como Nginx o Cloudflare)
    const ipAddress = headers['x-forwarded-for']?.split(',')[0] || ip; 

    // Intentar extraer dinámicamente un ID de entidad si existe en los parámetros (ej: /users/:id)
    const entityId = params?.id || body?.id || null;

    return next.handle().pipe(
      tap((responseData) => {
        // Clonar el body para la metadata y limpiar datos sensibles (ej: passwords)
        const metadata = { ...body };
        if (metadata.password) metadata.password = '********';
        
        // Agregar respuesta si es necesario, de forma controlada
        if (responseData && typeof responseData === 'object') {
          metadata.responseId = responseData.id;
        }

        this.auditService.createLog({
          userId: user?.id || null,
          role: user?.role || null,
          action: auditOptions.action,
          entityType: auditOptions.entityType,
          entityId,
          metadata,
          ipAddress,
          userAgent,
          success: true,
        });
      }),
      catchError((error) => {
        this.auditService.createLog({
          userId: user?.id || null,
          role: user?.role || null,
          action: auditOptions.action,
          entityType: auditOptions.entityType,
          entityId,
          metadata: {
            body: body ? { ...body, password: body.password ? '********' : undefined } : {},
            error: error.message || error,
          },
          ipAddress,
          userAgent,
          success: false,
        });
        return throwError(() => error);
      }),
    );
  }
}