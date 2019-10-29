import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServiceBase } from 'src/common/serviceBase';
import { ProjectService } from 'src/project/project.service';
import { MarketService } from 'src/market/market.service';

@WebSocketGateway()
export class ProjectGateway extends ServiceBase implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  constructor(private readonly projectService: ProjectService,
    private readonly marketService: MarketService) {
    super(ProjectGateway.name);
    this.marketService.marketEmitter.on('marketUpdated', (marketAddress) => this.broadcastUpdatedMarket(marketAddress))
    this.marketService.vaultEmitter.on('vaultUpdated', (vaultAddress) => this.broadcastUpdatedVault(vaultAddress))
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.info(`Client connected`);
    const projects = await this.projectService.getProjects();
    client.emit('projects', projects)
  }

  public async broadcastUpdatedMarket(marketAddress: string) {
    const project = await this.projectService.getProjectByMarketAddress(marketAddress);
    if (project) {
      this.server.emit('project', project);
    }
  }

  public async broadcastUpdatedVault(vaultAddress: string) {
    const project = await this.projectService.getProjectByVaultAddress(vaultAddress);
    if (project) {
      this.server.emit('project', project);
    }
  }
}