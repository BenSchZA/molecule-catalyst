import { LoggerService } from "./logger.service";

export abstract class ServiceBase {
  protected readonly logger: LoggerService

  constructor(loggerContext: string) {
    this.logger =  new LoggerService(loggerContext);
  }
}