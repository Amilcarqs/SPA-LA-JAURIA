import { Role } from 'src/generated/prisma/enums';

export interface AuditContext {
  userId?: string;
  role?: Role;

  ipAddress?: string;
  userAgent?: string;
}