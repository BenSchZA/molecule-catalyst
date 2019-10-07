import { ethers, constants } from "@panterazar/ethers";
import { getGasPrice, getBlockchainObjects } from "blockchainResources";
import { IMarket, IVault, ERC20Detailed } from "@molecule-protocol/catalyst-contracts";
import { MarketDataLegacy, PhaseData, FundingState } from './types';
import { getDaiContract } from 'domain/authentication/chain';
import { BigNumber } from "@panterazar/ethers/utils";

export async function getProjectTokenDetails(marketAddress: string) {
  try {
    // Get blockchain objects
    const { provider, signerAddress } = await getBlockchainObjects();
    // Get contract instances
    const market = new ethers.Contract(marketAddress, IMarket, provider);

    // Get data
    const active = await market.active();
    const balance: BigNumber = (signerAddress) ? await market.balanceOf(signerAddress) : constants.Zero;
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
  const { signer, signerAddress } = await getBlockchainObjects();

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
  const { signerAddress } = await getBlockchainObjects();

  // Get contract instances
  if (signerAddress) {
  const daiContract = await getDaiContract();
  const allowance = await daiContract.allowance(signerAddress, spender);

  return allowance;
  } else {
    return 0.0
  }
}

async function approve(address, value: BigNumber) {
  const allowanceValue: BigNumber = await allowance(address);

  if(allowanceValue.lt(value)) {
    const {signer, daiAddress} = await getBlockchainObjects();
    console.log("Increasing allowance");
    // Get contract instances
    const daiContract = new ethers.Contract(daiAddress, ERC20Detailed, signer);
    const txReceipt = await daiContract.approve(address, value);
    await (txReceipt).wait();
    return true;
  } else {
    console.log("Allowance already set");
    return false;
  }
}

export async function burn(marketAddress: string, tokenAmount: number) {
  // Get blockchain objects
  const { signer } = await getBlockchainObjects();
  const signerAddress = await signer.getAddress();

  // Get contract instances
  const market = await new ethers.Contract(marketAddress, IMarket, signer);

  // Burn all tokens
  const txReceipt = await market.burn(
    ethers.utils.parseUnits(tokenAmount.toString(), 18),
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
  const vault = await new ethers.Contract(vaultAddress, IVault, signer);

  // Withdraw all available funds
  await Promise.all(phases.filter(phase => phase.state === FundingState.ENDED)
    .map(async (phase: PhaseData) => vault.withdraw(phase.index)));

  return true;
}