import { SetMetadata } from '@nestjs/common';

export interface AuditOptions {
  action: string;     // Ej: 'CREATE_USER', 'UPDATE_PET_SPA'
  entityType?: string; // Ej: 'Users', 'Pet'
}

export const AUDIT_KEY = 'audit_log_options';
export const AuditAction = (options: AuditOptions) => SetMetadata(AUDIT_KEY, options);