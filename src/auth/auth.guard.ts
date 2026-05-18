import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    // En auth.guard.ts
    console.log('Token recibido:', token); // Para ver si Thunder Client lo envía bien
    try {
      const payload = await this.jwtService.verifyAsync(token);
      // 💡 Here the JWT secret key that's used for verifying the payload ESTO SE PONE EN CASO DE TENER global: true en auth.module.ts
      // is the key that was passed in the JwtModule
      /* const payload = await this.jwtService.verifyAsync(token, {
        secret: 'TU_JWT_SECRET', // Asegúrate de que coincida con tu módulo
      }); */
      console.log('Payload decodificado:', payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      
      request['user'] = payload;
    } catch (error) {
      // Esto te dirá si expiró o si la firma es inválida
      if (error instanceof Error) {
        console.error('Error de verificación JWT:', error.message);
      } else {
        console.error('Error desconocido de verificación JWT:', error);
      }
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
