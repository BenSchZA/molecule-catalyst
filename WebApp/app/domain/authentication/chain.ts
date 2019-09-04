import { ethers } from "ethers";
import { ERC20Detailed } from "@molecule-protocol/catalyst-contracts";
import { getBlockchainObjects } from "blockchainResources";

export async function getDaiContract() {
  try {
    // Get blockchain objects
    const { signer, daiAddress } = await getBlockchainObjects();

    // Get contract instances
    const daiContract = await new ethers.Contract(daiAddress, JSON.stringify(ERC20Detailed), signer);

    return daiContract;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getDaiBalance() {
  try {
    // Get blockchain objects
    const { signer } = await getBlockchainObjects();
    const signerAddress = await signer.getAddress();

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