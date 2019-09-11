import { createStore, Store } from 'redux';
import { ServiceBase } from 'src/common/serviceBase';
import { Contract, Wallet, ethers, Event } from 'ethers';
import { Provider } from 'ethers/providers';
import { ConfigService } from 'src/config/config.service';
import { IMarket, ERC20Detailed } from '@molecule-protocol/catalyst-contracts';
import { MarketReducer } from './market.reducer';
import { MarketDocument } from './market.schema';
import { mintAction, burnAction, transferAction } from './market.actions';
import { BigNumber } from 'ethers/utils';
import throttle = require('lodash/throttle');
import {rehydrateMarketData} from './mongoRehydrationHelpers';


export class MarketState extends ServiceBase {
  private readonly marketContract: Contract;
  private readonly marketState: Store<any>;
  private readonly daiContract: Contract;

  constructor(
    private readonly marketAddress: string,
    private readonly stateDocument: MarketDocument,
    private readonly ethersProvider: Provider,
    private readonly config: ConfigService) {
    super(`${MarketState.name}-${marketAddress}`);
    const serverAccountWallet = new Wallet(this.config.get('serverWallet').privateKey, this.ethersProvider);
    this.marketContract = new Contract(this.marketAddress, IMarket, this.ethersProvider).connect(serverAccountWallet);
    this.daiContract = new Contract(this.config.get('contracts').dai, ERC20Detailed, this.ethersProvider).connect(serverAccountWallet);

    this.marketState = this.stateDocument.isNew ? createStore(MarketReducer) : createStore(MarketReducer, rehydrateMarketData(this.stateDocument.marketData));

    this.marketState.subscribe(throttle(() => {
      this.stateDocument.marketData = this.marketState.getState();
      this.stateDocument.markModified('marketData');
      this.stateDocument.save();
    }, 1000));

    this.startListening()
  }

  async startListening() {
    // get all logs from latest block in DB up until the current block, and update fixture state
    if (this.stateDocument.isNew) {
      this.stateDocument.marketData = this.marketState.getState();
      this.stateDocument.markModified('marketData');
      await this.stateDocument.save();
    }
    const fromBlock = (this.stateDocument.marketData && this.stateDocument.marketData.lastBlockUpdated) ?
      this.stateDocument.marketData.lastBlockUpdated + 1 : 0;

    const mintFilter = {
      ...this.marketContract.filters.Mint(),
      fromBlock: fromBlock
    };

    const mints = await this.ethersProvider.getLogs(mintFilter);
    const mintActions = await Promise.all(mints.map(async log => {
      const parsed = this.marketContract.interface.parseLog(log).values;

      return mintAction({
        userAddress: parsed.to,
        amountMinted: parsed.amountMinted,
        collateralAmount: parsed.amountSpent,
        reseachContribution: parsed.taxGiven,
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
        timestamp: new Date((await this.ethersProvider.getBlock(log.blockNumber)).timestamp * 1000),
      })
    }))

    const burnFilter = {
      ...this.marketContract.filters.Burn(),
      fromBlock: fromBlock
    };

    const burns = await this.ethersProvider.getLogs(burnFilter);

    const burnActions = await Promise.all(burns.map(async log => {
      const parsed = this.marketContract.interface.parseLog(log).values;
      return burnAction({
        userAddress: parsed.to,
        amountBurnt: parsed.amountBurnt,
        collateralReturned: parsed.collateralReturned,
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
        timestamp: new Date((await this.ethersProvider.getBlock(log.blockNumber)).timestamp * 1000),
      })
    }))

    const transferFilter = {
      ...this.marketContract.filters.Transfer(),
      fromBlock: fromBlock
    };

    const transfers = await this.ethersProvider.getLogs(transferFilter);

    const transferActions = await Promise.all(transfers.map(log => ({
      ...log,
      ...this.marketContract.interface.parseLog(log)
    }))
      .filter(t => t.values.from !== ethers.constants.AddressZero && t.values.to !== ethers.constants.AddressZero)
      .map(async t => transferAction({
        amount: t.values.value,
        fromAddress: t.values.from,
        toAddress: t.values.to,
        blockNumber: t.blockNumber,
        txHash: t.transactionHash,
        timestamp: new Date((await this.ethersProvider.getBlock(t.blockNumber)).timestamp * 1000)
      })))

    const allActions = [...mintActions, ...burnActions, ...transferActions].sort((a, b) => a.payload.blockNumber - b.payload.blockNumber);
    this.logger.info(`Found ${allActions.length} new transaction.`);

    allActions.forEach(action => this.marketState.dispatch(action));

    // Set up listener for transfer event, create appropriate action, dispatch against store
    this.marketContract.on(this.marketContract.filters.Transfer(),
      async (from: string, to: string, value: BigNumber, event: Event) => {
        if (((!this.stateDocument.marketData.lastBlockUpdated) || event.blockNumber > this.stateDocument.marketData.lastBlockUpdated) && 
          from !== ethers.constants.AddressZero && to !== ethers.constants.AddressZero) {
          this.logger.info(`New Transfer received.`);
          const action = transferAction({
            fromAddress: from,
            toAddress: to,
            amount: value,
            blockNumber: event.blockNumber,
            txHash: event.transactionHash,
            timestamp: new Date((await this.ethersProvider.getBlock(event.blockNumber)).timestamp * 1000)
          })
          this.marketState.dispatch(action);
        }
      }
    );

    // Set up listener for mint event, create appropriate action, dispatch against store
    this.marketContract.on(this.marketContract.filters.Mint(),
      async (to: string, amountMinted: BigNumber, collateralAmount: BigNumber, researchContribution: BigNumber, event) => {
        if ((!this.stateDocument.marketData.lastBlockUpdated) || event.blockNumber > this.stateDocument.marketData.lastBlockUpdated) {
          this.logger.info(`New Mint received.`);
          const action = mintAction({
            userAddress: to,
            amountMinted: amountMinted,
            collateralAmount: collateralAmount,
            reseachContribution: researchContribution,
            blockNumber: event.blockNumber,
            txHash: event.transactionHash,
            timestamp: new Date((await this.ethersProvider.getBlock(event.blockNumber)).timestamp * 1000)
          })
          this.marketState.dispatch(action);
        }
      })

    this.marketContract.on(this.marketContract.filters.Burn(),
      async (from: string, amountBurnt: BigNumber, collateralReturned: BigNumber, event) => {
        if ((!this.stateDocument.marketData.lastBlockUpdated) || event.blockNumber > this.stateDocument.marketData.lastBlockUpdated) {
          this.logger.info(`New Burn received.`);
          const action = burnAction({
            userAddress: from,
            amountBurnt: amountBurnt,
            collateralReturned: collateralReturned,
            blockNumber: event.blockNumber,
            txHash: event.transactionHash,
            timestamp: new Date((await this.ethersProvider.getBlock(event.blockNumber)).timestamp * 1000)
          })
          this.marketState.dispatch(action);
        }
      })
  }
}