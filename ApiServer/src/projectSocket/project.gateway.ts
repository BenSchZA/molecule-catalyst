import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
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
    this.marketService.marketEmitter.on('marketUpdated', (marketAddress) => this.broadcastUpdatedProject(marketAddress))
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.info(`Client connected`);
    const projects = await this.projectService.getProjects();
    client.emit('message', projects)
  }

  public async broadcastUpdatedProject(marketAddress: string) {
    const project = await this.projectService.getProjectByMarketAddress(marketAddress);
    if (!project) {
      this.logger.warn(`Project with market address ${marketAddress} does not exist.`);
      return;
    }
    this.server.emit('message', project);
  }
}