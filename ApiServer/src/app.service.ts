import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { LoggerService } from './common/logger.service';
import { ServiceBase } from './common/serviceBase';

@Injectable()
export class AppService extends ServiceBase {
  constructor(private readonly config: ConfigService) {
    super(AppService.name);
  }

  root(): any {
    return {
      name: this.config.get('app').name,
      version: this.config.get('app').version,
      description: this.config.get('app').description,
    };
  }
}
