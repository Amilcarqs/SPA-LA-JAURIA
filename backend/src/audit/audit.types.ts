import { Role } from '@prisma/client';

export interface AuditContext {
  userId?: string;
  role?: Role;

  ipAddress?: string;
  userAgent?: string;
}