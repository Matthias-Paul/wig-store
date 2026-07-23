import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { initFirebaseAdmin } from './firebase/firebase-admin.provider';

async function bootstrap() {
  // initFirebaseAdmin();

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(helmet());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
