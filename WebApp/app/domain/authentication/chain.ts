import { ethers } from "@panterazar/ethers";
import { ERC20Detailed } from "@molecule-protocol/catalyst-contracts";
import { getBlockchainObjects } from "blockchainResources";

export async function getDaiContract() {
  try {
    // Get blockchain objects
    const { provider, daiAddress } = await getBlockchainObjects();

    // Get contract instances
    const daiContract = new ethers.Contract(daiAddress, JSON.stringify(ERC20Detailed), provider);

    return daiContract;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getDaiBalance() {
  try {
    // Get blockchain objects
    const { signerAddress } = await getBlockchainObjects();

    if(!signerAddress) {
      return 0.0;
    }

    // Get contract instances
    const daiContract = await getDaiContract();

    // Get data
    const balance = await daiContract.balanceOf(signerAddress);
    const decimals = await getDaiDecimals();

    return parseFloat(ethers.utils.formatUnits(balance, decimals));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getDaiDecimals() {
  try {
    // Get contract instances
    const daiContract = await getDaiContract();

    // Get data
    const decimals = await daiContract.decimals();

    return decimals;
  } catch (error) {
    console.log(error);
    throw error;
  }
}