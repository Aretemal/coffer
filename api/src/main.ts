import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function isLocalDevOrigin(origin: string): boolean {
  try {
    const u = new URL(origin);
    const h = u.hostname.toLowerCase();
    return (
      h === 'localhost' ||
      h === '127.0.0.1' ||
      h === '0.0.0.0' ||
      h === '::1'
    );
  } catch {
    return false;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prod = process.env.NODE_ENV === 'production';
  const configured = process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()).filter(Boolean);

  app.enableCors({
    origin: prod
      ? (configured?.length ? configured : false)
      : (origin, cb) => {
          if (!origin) {
            cb(null, true);
            return;
          }
          if (isLocalDevOrigin(origin)) {
            cb(null, true);
            return;
          }
          if (configured?.includes(origin)) {
            cb(null, true);
            return;
          }
          cb(null, false);
        },
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'apollo-require-preflight',
      'x-apollo-operation-name',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // GraphQL @InputType() поля без class-validator с whitelist:true вырезаются
      // (пустой password → bcrypt "data and salt arguments required").
      whitelist: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
}
bootstrap();
