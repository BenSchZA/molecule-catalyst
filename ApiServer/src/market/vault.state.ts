import { createStore, Store } from 'redux';
import { ServiceBase } from 'src/common/serviceBase';
import { Contract, Wallet, ethers, Event } from '@panterazar/ethers';
import { Provider } from '@panterazar/ethers/providers';
import { ConfigService } from 'src/config/config.service';
import { IVault, ERC20Detailed } from '@molecule-protocol/catalyst-contracts';
import throttle = require('lodash/throttle');
import { VaultReducer } from './vault.reducer';
import { VaultDocument } from './vault.schema';
import { contributeAction, setCurrentPhaseAction, addPhase, updatePhase, setOutstandingWithdraw } from './vault.actions';
import { rehydrateVaultData } from './mongoRehydrationHelpers';


export class VaultState extends ServiceBase {
  private readonly vaultContract: Contract;
  private readonly daiContract: Contract;
  private readonly vaultState: Store<any>;

  constructor(
    private readonly vaultAddress: string,
    private readonly stateDocument: VaultDocument,
    private readonly ethersProvider: Provider,
    private readonly config: ConfigService) {
    super(`${VaultState.name}-${vaultAddress}`);
    const daiAddress = this.config.get('contracts').dai;
    const serverAccountWallet = new Wallet(this.config.get('serverWallet').privateKey, this.ethersProvider);
    this.vaultContract = new Contract(this.vaultAddress, IVault, this.ethersProvider).connect(serverAccountWallet);
    this.daiContract = new Contract(daiAddress, ERC20Detailed, this.ethersProvider).connect(serverAccountWallet);
    this.vaultState = this.stateDocument.isNew ? createStore(VaultReducer) : createStore(VaultReducer, rehydrateVaultData(this.stateDocument.vaultData));
    this.vaultState.subscribe(throttle(() => {
      this.stateDocument.vaultData = this.vaultState.getState();
      this.stateDocument.markModified('vaultData');
      this.stateDocument.save();
    }, 1000));

    this.startListening()
  }

  async startListening() {
    const fromBlock = (this.stateDocument.vaultData && this.stateDocument.vaultData.lastBlockUpdated) ?
      this.stateDocument.vaultData.lastBlockUpdated + 1 : 0;
    // get all logs from latest block in DB up until the current block, and update fixture state
    const marketAddress = await this.vaultContract.market();

    const outstandingWithdraw = await this.vaultContract.outstandingWithdraw();
    this.vaultState.dispatch(setOutstandingWithdraw(outstandingWithdraw));

    if (this.stateDocument.isNew) {  
      // Get all the phases, and store them in state
      const totalPhases = await this.vaultContract.getTotalRounds();
      for (let i = 0; i < totalPhases; i++) {
        const phase = await this.getPhaseData(i);
        this.vaultState.dispatch(addPhase({ ...phase, index: i }));
      }
    }

    const contributionFilter = {
      ...this.daiContract.filters.Transfer(marketAddress, this.vaultAddress),
      fromBlock: fromBlock
    };
    const contributionLogs = await this.ethersProvider.getLogs(contributionFilter);
    this.logger.info(`Found ${contributionLogs.length} new transactions`);
    contributionLogs.forEach(log => {
      const parsedLog = this.daiContract.interface.parseLog(log).values;
      this.vaultState.dispatch(contributeAction({
        ...parsedLog,
        blockNumber: log.blockNumber,
        value: parsedLog.value
      }));
    });

    const currentPhase = await this.vaultContract.currentPhase();
    this.vaultState.dispatch(setCurrentPhaseAction(parseInt(currentPhase)));
    
    this.daiContract.on(this.daiContract.filters.Transfer(marketAddress, this.vaultAddress),
      async (from, to, value, event) => {
        if (event.blockNumber > this.stateDocument.vaultData.lastBlockUpdated) {
          this.logger.info(`Vault transfer received. Allocating.`);
          this.vaultState.dispatch(contributeAction({
            blockNumber: event.blockNumber,
            value: value,
          }));

          const phase = await this.getPhaseData(this.stateDocument.vaultData.activePhase);
          this.logger.info(`Updating phase ${phase.index + 1} data`);
          this.vaultState.dispatch(updatePhase({
            ...phase,
            index: parseInt(phase.index),
          }));
        }
      });
    
    this.vaultContract.on(this.vaultContract.filters.PhaseFinalised(),
      async (index, amount, event) => {
        this.logger.info(`Phase ${parseInt(index)} finalised`);
        const updatedPhase = parseInt(await this.vaultContract.currentPhase());
        this.vaultState.dispatch(setCurrentPhaseAction(updatedPhase));

        const outstandingWithdraw = await this.vaultContract.outstandingWithdraw();
        this.vaultState.dispatch(setOutstandingWithdraw(outstandingWithdraw));

        const phase = await this.getPhaseData(updatedPhase);
        this.vaultState.dispatch(updatePhase({
          ...phase,
          index: parseInt(phase.index) 
        }));
      });

    this.vaultContract.on(this.vaultContract.filters.FundingWithdrawn(), async (index, amount, _) => {
      this.logger.info(`Phase ${parseInt(index)} funding withdrawn: ${parseInt(amount)}`);
      const updatedPhase = parseInt(await this.vaultContract.currentPhase());
      this.vaultState.dispatch(setCurrentPhaseAction(updatedPhase));

      const outstandingWithdraw = await this.vaultContract.outstandingWithdraw();
      this.vaultState.dispatch(setOutstandingWithdraw(outstandingWithdraw));

      const phase = await this.getPhaseData(updatedPhase);
      this.vaultState.dispatch(updatePhase({
        ...phase,
        index: parseInt(phase.index) 
      }));
    });
  }

  async getPhaseData(phaseNo) {
    const rawPhase = await this.vaultContract.fundingPhase(phaseNo);

    return {
      index: phaseNo,
      fundingThreshold: rawPhase[0],
      fundingRaised: rawPhase[1],
      phaseDuration: parseInt(rawPhase[2]),
      startDate: new Date(rawPhase[3].mul(1000).toNumber()),
      state: rawPhase[4],
    }
  }
}