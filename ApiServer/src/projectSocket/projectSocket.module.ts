import { Module, forwardRef } from '@nestjs/common';
import { ProjectGateway } from './project.gateway';
import { ProjectModule } from 'src/project/project.module';
import { MarketModule } from 'src/market/market.module';

@Module({
  imports: [ProjectModule,
            MarketModule],
  providers: [ProjectGateway],
})
export class ProjectSocketModule { }
