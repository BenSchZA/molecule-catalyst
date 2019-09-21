import { ethers } from "ethers";
import { getGasPrice, getBlockchainObjects } from "blockchainResources";
import { IMarketRegistry, IMarketFactory, IMarket, IVault } from "@molecule-protocol/catalyst-contracts";
import { MarketDataLegacy, PhaseData, FundingState } from './types';
import { getDaiContract } from 'domain/authentication/chain';
import { BigNumber } from "ethers/utils";

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
    const marketRegistry = await new ethers.Contract(marketRegistryAddress, JSON.stringify(IMarketRegistry), signer);
    const marketFactory = await new ethers.Contract(marketFactoryAddress, JSON.stringify(IMarketFactory), signer);

    // Deploy market
    const txReceipt = await (await marketFactory.deployMarket(
      fundingGoals.map(value => ethers.utils.parseEther(value.toString())),
      phaseDurations,
      signerAddress,
      curveType,
      taxationRate,
      { 
        gasPrice: await getGasPrice(),
        gasLimit: 3000000,
      }
    )).wait();

    // Parse event logs
    // event MarketCreated(uint256 index, address indexed marketAddress, address indexed vault, address indexed creator);
    let parsedLogs = txReceipt.logs
      .map(log => marketRegistry.interface.parseLog(log))
      .filter(parsedLog => parsedLog != null);
    let targetLog = parsedLogs
      .filter(log => log.signature == marketRegistry.interface.events.MarketCreated.signature)
      .filter(parsedEvent => parsedEvent.values.creator == signerAddress)[0];

    const result = {
      block: txReceipt.blockNumber,
      index: parseInt(targetLog.values.index._hex),
      marketAddress: targetLog.values.marketAddress,
      vaultAddress: targetLog.values.vault,
      creatorAddress: targetLog.values.creator,
    };

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getProjectTokenDetails(marketAddress: string) {
  try {
    // Get blockchain objects
    const { signer } = await getBlockchainObjects();
    const signerAddress = await signer.getAddress();

    // Get contract instances
    const market = await new ethers.Contract(marketAddress, JSON.stringify(IMarket), signer);

    // Get data
    const active = await market.active();
    const balance: BigNumber = await market.balanceOf(signerAddress);
    const totalSupply: BigNumber = await market.totalSupply();
    const decimals: BigNumber = await market.decimals();
    const taxationRate: BigNumber = await market.taxationRate();
    const tokenPrice: BigNumber = await market.priceToMint(ethers.utils.parseEther('1'));
    const poolValue: BigNumber = await market.rewardForBurn(totalSupply);
    const holdingsValue: BigNumber = await market.rewardForBurn(balance);

    const result: MarketDataLegacy = {
      active: active,
      balance: balance.toString(),
      totalSupply: totalSupply.toString(),
      decimals: decimals.toNumber(),
      taxationRate: taxationRate.toNumber(),
      tokenPrice: tokenPrice.toString(),
      poolValue: poolValue.toString(),
      holdingsValue: holdingsValue.toString(),
    };

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function mint(marketAddress, contribution) {
  // Get blockchain objects
  const { signer } = await getBlockchainObjects();
  const signerAddress = await signer.getAddress();

  // Get contract instances
  const market = await new ethers.Contract(marketAddress, JSON.stringify(IMarket), signer);

  const tokenValue = await market.collateralToTokenBuying(
    ethers.utils.parseUnits(`${contribution}`, 18)
  );

  await approve(marketAddress, ethers.utils.parseUnits(contribution.toString(), 18));

  const txReceipt = await market.mint(
    signerAddress, tokenValue,
    { gasPrice: await getGasPrice() }
  );
  const txResult = await (txReceipt).wait();

  // Parse event logs
  // event Transfer(address indexed from, address indexed to, uint value);
  let parsedLogs = txResult.logs
    .map(log => market.interface.parseLog(log))
    .filter(parsedLog => parsedLog != null);
  let targetLog = parsedLogs
    .filter(log => log.signature == market.interface.events.Transfer.signature)
    .filter(parsedEvent => parsedEvent.values.to == signerAddress)[0];

  return {
    from: targetLog.values.from,
    to: targetLog.values.to,
    value: targetLog.values.value._hex,
  }
}

async function allowance(spender) {
  // Get blockchain objects
  const { signer } = await getBlockchainObjects();
  const signerAddress = await signer.getAddress();

  // Get contract instances
  const daiContract = await getDaiContract();
  const allowance = await daiContract.allowance(signerAddress, spender);

  console.log(allowance);
  return allowance;
}

async function approve(address, value: BigNumber) {
  const allowanceValue: BigNumber = await allowance(address);

  if(allowanceValue.lt(value)) {
    console.log("Increasing allowance");
    // Get contract instances
    const daiContract = await getDaiContract();
    const txReceipt = await daiContract.approve(address, value);
    const result = await (txReceipt).wait();
    console.log(result);
    return true;
  } else {
    console.log("Allowance already set");
    return false;
  }
}

export async function burn(marketAddress) {
  // Get blockchain objects
  const { signer } = await getBlockchainObjects();
  const signerAddress = await signer.getAddress();

  // Get contract instances
  const market = await new ethers.Contract(marketAddress, JSON.stringify(IMarket), signer);

  // Burn all tokens
  const balance = await market.balanceOf(signerAddress);
  const txReceipt = await market.burn(
    balance,
    { gasPrice: await getGasPrice() }
  );
  const txResult = await (txReceipt).wait();

  // Parse event logs
  // event Transfer(address indexed from, address indexed to, uint value);
  let parsedLogs = txResult.logs
    .map(log => market.interface.parseLog(log))
    .filter(parsedLog => parsedLog != null);
  let targetLog = parsedLogs
    .filter(log => log.signature == market.interface.events.Transfer.signature)
    .filter(parsedEvent => parsedEvent.values.to == signerAddress)[0];

  return {
    from: targetLog.values.from,
    to: targetLog.values.to,
    value: targetLog.values.value._hex,
  }
}

export async function withdrawAvailable(vaultAddress, phases) {
  // Get blockchain objects
  const { signer } = await getBlockchainObjects();

  // Get contract instances
  const vault = await new ethers.Contract(vaultAddress, JSON.stringify(IVault), signer);

  // Withdraw all available funds
  await Promise.all(phases.filter(phase => phase.state === FundingState.ENDED)
    .map(async (phase: PhaseData) => vault.withdraw(phase.index)));

  return true;
}