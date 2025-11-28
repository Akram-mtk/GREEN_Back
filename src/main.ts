import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads')),
  );

  // Global validation (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strips properties not in DTO
      forbidNonWhitelisted: true, // throws error if unknown props are sent
      transform: true,            // transforms payloads to DTO instances
    })
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  )

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
