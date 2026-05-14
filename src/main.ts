import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // simple request logger to help debugging
  app.use((req, res, next) => {
    console.log('<< HTTP', req.method, req.url);
    next();
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
