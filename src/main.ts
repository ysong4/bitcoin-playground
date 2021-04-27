import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import fs from 'fs';
import path from 'path';

async function bootstrap() {
  // Setup TLS
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './self-signed-tls/MyKey.key')),
    cert: fs.readFileSync(
      path.join(__dirname, './self-signed-tls/MyCertificate.crt'),
    ),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions: httpsOptions,
  });
  const configService = app.get(ConfigService);

  // class-validation setup
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Bitcoin Playground')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
