import { Inject, Injectable } from '@nestjs/common';
import { ethers, Wallet, Contract } from '@panterazar/ethers';
import { Modules } from 'src/app.constants';
import { MarketFactory, IMarketRegistry } from '@molecule-protocol/catalyst-contracts';
import { ConfigService } from '../config/config.service';
import { ServiceBase } from 'src/common/serviceBase';
import { TransactionReceipt } from '@panterazar/ethers/providers';

@Injectable()
export class MarketFactoryService extends ServiceBase {
  private readonly marketFactoryContract: Contract;
  private readonly marketRegistryContract: Contract;

  constructor(
    @Inject(Modules.EthersProvider) private readonly ethersProvider: ethers.providers.Provider,
    private readonly config: ConfigService) {
    super(MarketFactoryService.name);
    const serverAccountWallet = new Wallet(this.config.get('serverWallet').privateKey, this.ethersProvider);
    const marketFactoryContract = new Contract(this.config.get('contracts').marketFactory, MarketFactory, this.ethersProvider);
    this.marketFactoryContract = marketFactoryContract.connect(serverAccountWallet);
    const marketRegistryContract = new Contract(this.config.get('contracts').marketRegistry, IMarketRegistry, this.ethersProvider);
    this.marketRegistryContract = marketRegistryContract.connect(serverAccountWallet);
  }

  public async addUserToAdminWhitelist(userAddress: string): Promise<void> {
    this.logger.debug(`Adding user to MarketFactory Admin Whitelist: ${userAddress}`);

    try {
      await (await this.marketFactoryContract.addWhitelistAdmin(userAddress)).wait();
      this.logger.info(`User added to MarketFactory Admin Whitelist: ${userAddress}`);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async isUserWhitelistAdmin(userAddress: string): Promise<boolean> {
    this.logger.debug(`Checking whether user is admin: ${userAddress}`);
    try {
      const result = await this.marketFactoryContract.isWhitelistAdmin(userAddress);
      return result;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  public async deployMarket(
    fundingGoals: Array<number>,
    phaseDurations: Array<number>,
    creatorAddress: string,
    curveType: number,
    taxationRate: number): Promise<{
      block: number,
      index: number,
      marketAddress: string,
      vaultAddress: string,
      creatorAddress: string
    }> {
    const txReceipt: TransactionReceipt = await (await this.marketFactoryContract.deployMarket(
      fundingGoals.map(value => ethers.utils.parseEther(value.toString())),
      phaseDurations,
      creatorAddress,
      curveType,
      taxationRate,
    )).wait();

    let parsedLogs = txReceipt.logs
      .map(log => this.marketRegistryContract.interface.parseLog(log))
      .filter(parsedLog => parsedLog != null);
    let targetLog = parsedLogs
      .filter(log => {
        return log.signature == this.marketRegistryContract.interface.events.MarketCreated.signature
      })[0]
    //.filter(parsedEvent => parsedEvent.values.creator == creatorAddress)[0];

    return {
      block: txReceipt.blockNumber,
      index: parseInt(targetLog.values.index._hex),
      marketAddress: targetLog.values.marketAddress,
      vaultAddress: targetLog.values.vault,
      creatorAddress: targetLog.values.creator,
    };
  };
}

