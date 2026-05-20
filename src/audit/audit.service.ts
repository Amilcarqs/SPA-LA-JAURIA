import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ajusta la ruta a tu PrismaService
import { Role } from 'src/generated/prisma/enums';

import { AuditAction } from './audit.constants';
import { AuditContext } from './audit.types';

export interface CreateAuditDto {
  userId?: string;
  role?: Role;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(data: CreateAuditDto) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          role: data.role,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          metadata: data.metadata || {},
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          success: data.success ?? true,
        },
      });
    } catch (error) {
      // Evita que un fallo en la auditoría rompa el flujo principal de la app
      console.error('Error al guardar el log de auditoría:', error);
    }
  }

   // ======================================
  // LOGIN EXITOSO
  // ======================================

  async logLoginSuccess(context: AuditContext) {
    await this.createLog({
      action: AuditAction.LOGIN_SUCCESS,

      userId: context.userId,
      role: context.role,

      ipAddress: context.ipAddress,
      userAgent: context.userAgent,

      success: true,
    });
  }

  // ======================================
  // LOGIN FALLIDO
  // ======================================

  async logLoginFailed(
    context: AuditContext,
    failedAttempts: number,
  ) {
    await this.createLog({
      action: AuditAction.LOGIN_FAILED,

      userId: context.userId,
      role: context.role,

      ipAddress: context.ipAddress,
      userAgent: context.userAgent,

      success: false,

      metadata: {
        failedAttempts,
      },
    });
  }

  // ======================================
  // CUENTA BLOQUEADA
  // ======================================

  async logAccountLocked(
    context: AuditContext,
    lockedUntil: Date,
  ) {
    await this.createLog({
      action: AuditAction.ACCOUNT_LOCKED,

      userId: context.userId,
      role: context.role,

      ipAddress: context.ipAddress,
      userAgent: context.userAgent,

      success: false,

      metadata: {
        lockedUntil,
      },
    });
  }
}