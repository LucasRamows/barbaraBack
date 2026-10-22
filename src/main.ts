import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/http-exception.filter';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  isCorsOriginAllowed,
  resolveCorsOrigins,
} from './config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const allowedOrigins = resolveCorsOrigins();

  app.enableCors({
    origin(origin, callback) {
      if (isCorsOriginAllowed(origin, allowedOrigins)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin not allowed by CORS policy'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const shouldExportOpenApi = process.argv.includes('--export-openapi');
  if (process.env.NODE_ENV !== 'production' || shouldExportOpenApi) {
    const config = new DocumentBuilder()
      .setTitle('Bárbara API')
      .setDescription('Plataforma de gestão e acompanhamento de alunos de academia')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    if (shouldExportOpenApi) {
      const outputPath = resolve(
        process.cwd(),
        process.env.OPENAPI_OUTPUT ?? 'openapi.json',
      );
      await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
      await app.close();
      return;
    }
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
