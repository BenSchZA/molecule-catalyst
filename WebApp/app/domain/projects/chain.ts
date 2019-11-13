import { ethers } from "ethers";
import { getGasPrice, getBlockchainObjects } from "blockchainResources";
import { IMarket, IVault, ERC20Detailed } from "@molecule-protocol/catalyst-contracts";
import { getDaiContract } from 'domain/authentication/chain';
import { BigNumber } from "ethers/utils";

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
    // Get contract instances
    const daiContract = new ethers.Contract(daiAddress, ERC20Detailed, signer);
    const txReceipt = await daiContract.approve(address, value);
    await (txReceipt).wait();
    return true;
  } else {
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

export async function withdraw(marketAddress: string, tokenAmount: number) {
  // Get blockchain objects
  const { signer } = await getBlockchainObjects();
  const signerAddress = await signer.getAddress();

  // Get contract instances
  const market = await new ethers.Contract(marketAddress, IMarket, signer);

  // Burn all tokens
  const txReceipt = await market.withdraw(
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

export async function withdrawAvailable(vaultAddress) {
  // Get blockchain objects
  const { signer } = await getBlockchainObjects();

  // Get contract instances
  const vault = await new ethers.Contract(vaultAddress, IVault, signer);

  // Withdraw all available funds
  await vault.withdraw();

  return true;
}