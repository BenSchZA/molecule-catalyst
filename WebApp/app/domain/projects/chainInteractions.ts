import { ethers } from "ethers";
import { getGasPrice, getBlockchainObjects } from "blockchainResources";
import { IMarketRegistry, IMarketFactory } from "@molecule-protocol/catalyst-contracts";
import { LaunchProjectData } from './types';

export async function deployMarket(
  fundingGoals: Array<number>,
  phaseDurations: Array<number>,
  curveType: number,
  taxationRate: number
) {
  try {
    // Get blockchain objects
    const { signer, marketRegistryAddress, marketFactoryAddress } = await getBlockchainObjects();
    const signerAddress = await signer.getAddress();

    // Get contract instances
    const marketRegistry = await new ethers.Contract(marketRegistryAddress, JSON.stringify(IMarketRegistry.abi), signer);
    const marketFactory = await new ethers.Contract(marketFactoryAddress, JSON.stringify(IMarketFactory.abi), signer);

    // Deploy market
    const txReceipt = await(await marketFactory.deployMarket(
      fundingGoals,
      phaseDurations,
      signerAddress,
      curveType,
      taxationRate,
      { gasPrice: await getGasPrice() }
    )).wait();

    // Parse event logs
    // event MarketCreated(uint256 index, address indexed marketAddress, address indexed vault, address indexed creator);
    let parsedLogs = txReceipt.logs
      .map(log => marketRegistry.interface.parseLog(log))
      .filter(parsedLog => parsedLog != null);
    let targetLog = parsedLogs
      .filter(log => log.signature == marketRegistry.interface.events.MarketCreated.signature)
      .filter(parsedEvent => parsedEvent.values.creator == signerAddress)[0];

    const result: LaunchProjectData = {
      block: txReceipt.blockNumber,
      index: parseInt(targetLog.values.index._hex),
      marketAddress: targetLog.values.marketAddress,
      vaultAddress: targetLog.values.vault,
      creatorAddress: targetLog.values.creator,
    };

    return { ...result }
  } catch (error) {
    console.log(error);
    throw error;
  }
}