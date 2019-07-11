import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongodbUri from 'mongodb-uri';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EthersProviderModule } from './ethers/ethersProvider.module';
import { StatusMonitorModule } from 'nest-status-monitor';
import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from './healthCheck.service';
import { PromModule, InboundMiddleware } from '@panterazar/nestjs-prom';

@Module({
  imports: [ConfigModule,
    StatusMonitorModule.setUp({
      pageTitle: 'Nest.js Monitoring Page',
      port: 3001,
      path: '/status',
      ignoreStartsWith: '/health/alive',
      spans: [
        {
          interval: 1, // Every second
          retention: 60, // Keep 60 datapoints in memory
        },
        {
          interval: 5, // Every 5 seconds
          retention: 60,
        },
        {
          interval: 15, // Every 15 seconds
          retention: 60,
        }
      ],
      chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        responseTime: true,
        rps: true,
        statusCodes: true,
      },
      healthChecks: []
    }),
    PromModule.forRoot({
      defaultLabels: {
        app: 'MolAPI',
      },
      useHttpCounterMiddleware: true,
    }),
    EthersProviderModule,
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
    // WinstonModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     transports: [
    //       new transports.Console({
    //         level: configService.get('log').level,
    //         handleExceptions: false,
    //         format: format.combine(format.prettyPrint(), format.cli()),
    //       }),
    //       new transports.File({
    //         filename: 'error.log',
    //         level: 'error',
    //         format: format.combine(format.json()),
    //       }),
    //     ],
    //   }),
    //   inject: [ConfigService],
    // }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: mongodbUri.formatMongoose(configService.get('mongodb')),
        useCreateIndex: true,
        useNewUrlParser: true,
        bufferCommands: false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InboundMiddleware)
      .exclude({
        path: '/metrics',
        method: RequestMethod.GET,
      })
      .forRoutes('*');
  }
}
