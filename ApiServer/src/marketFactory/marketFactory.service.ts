import { Inject, Injectable } from '@nestjs/common';
import { ethers, Wallet, Contract } from 'ethers';
import { Modules } from 'src/app.constants';
import { IMarketFactory } from '@molecule-protocol/catalyst-contracts';
import { ConfigService } from '../config/config.service';
import { ServiceBase } from 'src/common/serviceBase';

@Injectable()
export class MarketFactoryService  extends ServiceBase {
  private readonly marketFactoryContract: Contract;

  constructor(
      @Inject(Modules.EthersProvider) private readonly ethersProvider: ethers.providers.Provider,
      private readonly config: ConfigService) {
    super(MarketFactoryService.name);
    const serverAccountWallet = new Wallet(this.config.get('serverWallet').privateKey, this.ethersProvider);
    const contract = new Contract(this.config.get('contracts').marketFactory, IMarketFactory, this.ethersProvider);
    this.marketFactoryContract = contract.connect(serverAccountWallet);
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
}
