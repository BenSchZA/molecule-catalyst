import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { Logger } from 'winston';
import { Modules } from './app.constants';
import { LoggerService } from './logger.service';

@Injectable()
export class AppService {
  private readonly logger: LoggerService = new LoggerService(AppService.name);
  constructor(private readonly config: ConfigService) {}

  root(): any {
    this.logger.info('test info message');
    return {
      name: this.config.get('app').name,
      version: this.config.get('app').version,
      description: this.config.get('app').description,
    };
  }
}
