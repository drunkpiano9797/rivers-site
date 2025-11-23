import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
  app.enableCors({
    origin: allowed.length ? allowed : true,
    credentials: true
  });

  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(cookieParser());
  // CSRF cookie-based protection for state-changing routes
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'strict'
      }
    })
  );
  app.use((req: Request, res: Response, next: NextFunction) => {
    const token = (req as any).csrfToken ? (req as any).csrfToken() : null;
    if (token) {
      res.cookie('csrfToken', token, { sameSite: 'strict' });
      res.setHeader('x-csrf-token', token);
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();
