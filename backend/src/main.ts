import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { initFirebaseAdmin } from './firebase/firebase-admin.provider';
import * as express from 'express';

async function bootstrap() {
  initFirebaseAdmin();

  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Raw body ONLY for the Paystack webhook route — needed for signature verification
  app.use(
    '/api/v1/payments/webhook',
    express.raw({ type: 'application/json' }),
  );

  // Normal JSON parsing for every other route
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser());
  app.use(helmet());

  app.setGlobalPrefix('api/v1');

  const corsOrigins = [
    'http://localhost:3000',
    'http://localhost:4000',
    process.env.FRONTEND_URL,
    'https://www.rocks-hairmpire.com',
  ]
    .filter((origin): origin is string => Boolean(origin))
    .map((origin) => origin.replace(/\/$/, ''));

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE',   'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Guest-Id'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const firstMessage = firstError.constraints
          ? Object.values(firstError.constraints)[0]
          : 'Validation failed';

        return new BadRequestException(firstMessage);
      },
    }),
  );

  const port = process.env.INTERNAL_API_PORT || 4000;

  await app.listen(port, '0.0.0.0');
}
bootstrap();
