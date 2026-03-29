import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getJwtSecret } from './auth/auth.config';

async function bootstrap() {
  getJwtSecret();
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend apps
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8081',
      'https://dairy-farm-web.vercel.app',
      'https://dairy-farm-backend-8d9p.onrender.com',
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.onrender\.com$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger / OpenAPI (free) — used for docs and for generating a typed API client.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dairy Farm API')
    .setDescription('Dairy Farm Management API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  // Serve raw OpenAPI JSON at the conventional path used by tooling/scripts.
  // (SwaggerModule.setup is intended for Swagger UI; for JSON we expose an explicit route.)
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/api-json', (req, res) => res.json(document));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
}
bootstrap();
