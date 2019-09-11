import { Inject, Injectable } from '@nestjs/common';
import { ethers, Wallet, Contract } from 'ethers';
import { Modules } from 'src/app.constants';
import { IMarketRegistry } from '@molecule-protocol/catalyst-contracts';
import { ConfigService } from '../config/config.service';
import { ServiceBase } from 'src/common/serviceBase';

@Injectable()
export class MarketRegistryService extends ServiceBase {
  private readonly marketRegistryContract;

  constructor(
    @Inject(Modules.EthersProvider) private readonly ethersProvider: ethers.providers.Provider,
    private readonly config: ConfigService) {
    super(MarketRegistryService.name);
    const serverAccountWallet = new Wallet(this.config.get('serverWallet').privateKey, this.ethersProvider);
    this.marketRegistryContract = new Contract(this.config.get('contracts').marketRegistry, IMarketRegistry, this.ethersProvider).connect(serverAccountWallet);
  }

  public async addUserToAdminWhitelist(userAddress: string): Promise<void> {
    this.logger.debug(`Adding user to MarketRegistry Admin Whitelist: ${userAddress}`);

    try {
      await (await this.marketRegistryContract.addWhitelistAdmin(userAddress)).wait();
      this.logger.info(`User added to MarketRegistry Admin Whitelist: ${userAddress}`);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async isUserWhitelistAdmin(userAddress: string): Promise<boolean> {
    this.logger.debug(`Checking whether user is admin: ${userAddress}`);
    try {
      const result = await this.marketRegistryContract.isWhitelistAdmin(userAddress);
      return result;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  public async addMarketDeployer(userAddress: string): Promise<void> {
    this.logger.debug(`Adding user to MarketRegistry Approved Deployers: ${userAddress}`);
    if (!(await this.isMarketDeployer(userAddress))) {
      try {
        await (await this.marketRegistryContract.addMarketDeployer(userAddress, 'adding new deployer')).wait();
        this.logger.info(`User added to MarketRegistry Approved Deployers: ${userAddress}`);
      } catch (error) {
        this.logger.error(error.message);
        throw error;
      }
    } else {
      this.logger.error(`User ${userAddress} is already a deployer`);
    }
  }

  public async isMarketDeployer(userAddress: string): Promise<boolean> {
    this.logger.debug(`Checking whether user is a market deployer: ${userAddress}`);
    try {
      const result = await this.marketRegistryContract.isMarketDeployer(userAddress);
      return result;
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
