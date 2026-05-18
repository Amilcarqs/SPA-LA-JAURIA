import { SetMetadata } from '@nestjs/common';
import { Role } from '../generated/prisma/client';


export const ROLES_KEY = 'roles';


// esto es de la primera implementacion
//export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
