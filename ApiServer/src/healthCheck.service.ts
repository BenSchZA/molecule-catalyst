import {
    TerminusEndpoint,
    TerminusOptionsFactory,
    DNSHealthIndicator,
    TerminusModuleOptions,
    MongooseHealthIndicator,
  } from '@nestjs/terminus';
  import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
  
  @Injectable()
  export class TerminusOptionsService implements TerminusOptionsFactory {
    private readonly logger: LoggerService = new LoggerService(TerminusOptionsService.name);
    constructor(
      private readonly dns: DNSHealthIndicator,
      private readonly mongo: MongooseHealthIndicator,
    ) {}
  
    createTerminusOptions(): TerminusModuleOptions {
      const healthEndpoint: TerminusEndpoint = {
        url: '/health',
        healthIndicators: [
          async () => this.dns.pingCheck('DNS', 'https://google.com'),
          async () => this.mongo.pingCheck('MongoDb')
        ],
      };
      return {
        logger: (message: string, error: Error) => this.logger.warn(error.message),
        endpoints: [healthEndpoint],
      };
    }
  }