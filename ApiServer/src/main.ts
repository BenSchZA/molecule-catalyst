import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from './config/config.service';
import { LoggerService } from './common/logger.service';


async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {logger: new LoggerService('NEST')});

  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));

  app.use(helmet());
  app.enableCors();
  app.use(compression());
  app.setGlobalPrefix(appConfig.routePrefix);

  await app.listen(appConfig.port);
}

bootstrap();
