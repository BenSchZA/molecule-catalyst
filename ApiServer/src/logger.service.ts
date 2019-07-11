import { Logger, Injectable } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';

export enum LogLevel {
  info = 'info',
  warn = 'warn',
  error = 'error',
  debug = 'debug',
  verbose = 'verbose',
}

@Injectable()
export class LoggerService extends Logger {
  private readonly winstonLogger = createLogger({
    transports: [
      new transports.File({
        filename: 'apiserver.log',
        level: LogLevel.debug,
        format: format.combine(
          format.timestamp(),
          format.metadata(),
          format.prettyPrint(),
          format.json(),
        ),
      }),
      // new transports.Console({
      //   format: format.combine(
      //     format.colorize(),
      //     format.printf((message: any) => {
      //       const output = isObject(message.message)
      //         ? `${'Object:'}\n${JSON.stringify(message.message, null, 2)}\n`
      //         : `${message.message}${(message.durationMs ? ` Duration=${message.durationMs}ms` : '')}`;
        
      //       const localeStringOptions = {
      //         year: 'numeric',
      //         hour: 'numeric',
      //         minute: 'numeric',
      //         day: '2-digit',
      //         month: '2-digit',
      //       };
      //       const timestamp = new Date(Date.now()).toLocaleString(
      //         undefined,
      //         localeStringOptions,
      //       );
            
      //       let result = `[Nest] ${process.pid}   - ${timestamp}   [${message.context}] ${output}`;
      //       return result;
      //     })
      //   )
      // })
    ],
  })

  constructor(private readonly loggerContext: string = '') {
    super(loggerContext);
  }
  
  log(message: any, context?: string) {
    this.winstonLogger.log(LogLevel.info, message, {context});
    super.log(message, context);
  }
  
  info(message: any, context?: string) {
    this.winstonLogger.info(message, {context});
    super.log(message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.winstonLogger.error(message, {context});
    if (trace) {
      this.winstonLogger.error(trace)
    }
    super.error(message, trace, context);
  }
  
  warn(message: any, context?: string) {
    this.winstonLogger.warn(message, {context});
    super.warn(message, context);
  }
  
  debug(message: any, context?: string) {
    this.winstonLogger.debug(message, {context});
    super.debug(message, context);
  }
  
  verbose(message: any, context?: string) {
    this.winstonLogger.verbose(message, context);
    super.verbose(message, context);
  }

  startTimer() {
    return this.winstonLogger.startTimer();
  }
}
