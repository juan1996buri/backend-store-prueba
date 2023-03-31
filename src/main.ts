import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { setDefaultConfig } from './config/default-config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.use(cookieParser());
  const config = app.get(ConfigService);
  setDefaultConfig(config);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Consultorio clinico')
    .setDescription('prueba tecnica')
    .setVersion('v1')
    .addTag('prueba tecnica')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  const logger = new Logger();
  await app.listen(3000);
  logger.log(`se esta ejecutando en el puerto ${await app.getUrl()}`);
}
bootstrap();
