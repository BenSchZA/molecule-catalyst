import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ethers, Wallet, Contract } from 'ethers';
import { Modules, Schemas } from 'src/app.constants';
import { IMarketRegistry } from '@molecule-protocol/catalyst-contracts';
import { ConfigService } from '../config/config.service';
import { ServiceBase } from 'src/common/serviceBase';
import { InjectModel } from '@nestjs/mongoose';
import { MarketDocument, Market } from './market.schema';
import { Model } from 'mongoose';
import { MarketState } from './market.state';
import { VaultDocument, Vault } from './vault.schema';
import { VaultState } from './vault.state';

@Injectable()
export class MarketService extends ServiceBase implements OnModuleDestroy {
  private readonly marketRegistryContract: Contract;

  constructor(
      @Inject(Modules.EthersProvider) private readonly ethersProvider: ethers.providers.Provider,
      private readonly config: ConfigService,
      @InjectModel(Schemas.Market) private readonly marketRepository: Model<MarketDocument>,
      @InjectModel(Schemas.Vault) private readonly vaultRepository: Model<VaultDocument>) {
    super(MarketService.name);
    const marketRegistryAddress = this.config.get('contracts').marketRegistry;
    const serverAccountWallet = new Wallet(this.config.get('serverWallet').privateKey, this.ethersProvider);
    this.marketRegistryContract = new Contract(marketRegistryAddress, IMarketRegistry, this.ethersProvider).connect(serverAccountWallet);
    this.getAllDeployedMarkets();
    this.marketRegistryContract.on(this.marketRegistryContract.filters.MarketCreated(), (index, marketAddress, vault) => {
      this.createMarketListener(marketAddress);
      this.createVaultListener(vault);
    })
  }

  private async getAllDeployedMarkets() {
    const marketCreatedFilter = this.marketRegistryContract.filters.MarketCreated() as any;
    marketCreatedFilter.fromBlock = 0;
    marketCreatedFilter.toBlock = 'latest';
    const marketCreatedLogs = await this.ethersProvider.getLogs(marketCreatedFilter);
    marketCreatedLogs.map(log => this.marketRegistryContract.interface.parseLog(log).values)
      .map(async marketDeployed => {
        await this.createMarketListener(marketDeployed.marketAddress);
        await this.createVaultListener(marketDeployed.vault);
      });
  }

  private async createMarketListener(marketAddress: string): Promise<MarketState> {
    const marketDocument = (await this.marketRepository.findOne({marketAddress: marketAddress})) ? 
      await this.marketRepository.findOne({marketAddress: marketAddress}) : 
      await new this.marketRepository({marketAddress: marketAddress})

    
    return new MarketState(marketAddress, marketDocument, this.ethersProvider, this.config);
  }

  private async createVaultListener(vaultAddress: string): Promise<VaultState> {
    const vaultDocument = (await this.vaultRepository.findOne({vaultAddress: vaultAddress})) ? 
      await this.vaultRepository.findOne({vaultAddress: vaultAddress}) : 
      await new this.vaultRepository({vaultAddress: vaultAddress})
    
    return new VaultState(vaultAddress, vaultDocument, this.ethersProvider, this.config);
  }

  public async getMarketData(marketAddress: string): Promise<Market> {
    const marketDoc = await this.marketRepository.findOne({marketAddress: marketAddress});
    return marketDoc.toObject();
  }

  public async getVaultData(vaultAddress: string): Promise<Vault> {
    const vaultDoc = await this.vaultRepository.findOne({vaultAddress: vaultAddress});
    return vaultDoc.toObject();
  }

  onModuleDestroy() {
    throw new Error("Method not implemented.");
  }
}
