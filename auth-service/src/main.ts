import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('Authentication & user account management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('auth/docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT ?? 3051;
  await app.listen(port);
  console.log(`Auth service running on http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/auth/docs`);
}

bootstrap();
