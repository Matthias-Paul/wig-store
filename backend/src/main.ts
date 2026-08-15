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

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4000',
      'https://rocks-hairmpire.vercel.app',
      'https://www.rocks-hairmpire.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
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

  await app.listen(process.env.INTERNAL_API_PORT ?? 4000);
}
bootstrap();
