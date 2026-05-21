import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { AuditModule } from './audit/audit.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuditModule,
    AuthModule,
    UsersModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // esto es para el rate limit, se puede configurar para cada ruta o globalmente
    //para evitar fuerza bruta, ataques de denegación de servicio, etc
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        }
      ]
    })
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    // esto es para el rate limit, se puede configurar para cada ruta o globalmente
    //para evitar fuerza bruta, ataques de denegación de servicio, etc
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}