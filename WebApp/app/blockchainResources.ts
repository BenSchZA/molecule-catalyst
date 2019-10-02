import { BaseProvider } from "ethers/providers";
import { ethers, utils, Signer, getDefaultProvider } from "ethers";
import { getNetwork } from "ethers/utils";

export interface BlockchainResources {
  initialized: boolean,
  approvedNetwork: boolean,
  approvedNetworkName: string,
  approvedNetworkId: number,
  networkId: number,
  networkName: string,
  marketRegistryAddress: string,
  marketFactoryAddress: string,
  daiAddress: string,
  signer: Signer,
  provider: BaseProvider,
  signerAddress: string,
  ethereum: any,
  isStatus: boolean,
  isToshi: boolean,
  isMetaMask: boolean,
  isCipher: boolean,
}

export let blockchainResources: BlockchainResources = {
  initialized: false,
  approvedNetwork: false,
  approvedNetworkName: utils.getNetwork(parseInt(process.env.CHAIN_ID || '1')).name,
  approvedNetworkId: parseInt(process.env.CHAIN_ID || '1'),
  networkId: 0,
  networkName: '',
  daiAddress: "0x",
  marketRegistryAddress: "0x",
  marketFactoryAddress: "0x",
  // @ts-ignore
  signer: undefined,
  signerAddress: "",
  isCipher: false,
  isMetaMask: false,
  isStatus: false,
  isToshi: false,
};

async function fetchFromWindow() {
  const { web3 } = window as any;
  blockchainResources.provider = await new ethers.providers.Web3Provider(web3.currentProvider);
  // @ts-ignore
  const web3Provider = new ethers.providers.Web3Provider(web3.currentProvider);
  blockchainResources.signer = await web3Provider.getSigner();
  blockchainResources.signerAddress = await blockchainResources.signer.getAddress();
}

export async function initBlockchainResources() {
  const { web3, ethereum } = window as any;
  try {
    blockchainResources.provider = getDefaultProvider(getNetwork(parseInt(`${process.env.CHAIN_ID}`)))
    if (web3) {
      blockchainResources.isToshi = !!web3.currentProvider.isToshi;
      blockchainResources.isCipher = !!web3.currentProvider.isCipher;
      blockchainResources.isMetaMask = !!web3.currentProvider.isMetaMask;
      let isStatus = false;

      let accountArray: string[] | any = [];
      if (blockchainResources.isMetaMask) {
        accountArray = await ethereum.send('eth_requestAccounts');
        if (accountArray.code && accountArray.code == 4001) {
          throw ("Connection rejected");
        }
      } else if (blockchainResources.isToshi) {
        // Unlocked already
      } else if (blockchainResources.isCipher) {

      } else {
        if (ethereum) {
          blockchainResources.isStatus = !!ethereum.isStatus;
          if (isStatus) {
            await ethereum.enable();
          }
        }
      }

      // @ts-ignore
      await blockchainResources.provider.ready;
      const web3Provider = new ethers.providers.Web3Provider(web3.currentProvider);
      blockchainResources.signer = await web3Provider.getSigner();
      blockchainResources.signerAddress = await blockchainResources.signer.getAddress();

      blockchainResources.networkId = (await web3Provider.getNetwork()).chainId;
      blockchainResources.networkName = utils.getNetwork(blockchainResources.networkId).name;
      blockchainResources.marketRegistryAddress = `${process.env.MARKET_REGISTRY_ADDRESS}`;
      blockchainResources.marketFactoryAddress = `${process.env.MARKET_FACTORY_ADDRESS}`;
      blockchainResources.daiAddress = `${process.env.DAI_CONTRACT_ADDRESS}`;
      ``
      if (blockchainResources.networkId == parseInt(`${process.env.CHAIN_ID}`)) {
        blockchainResources.approvedNetwork = true;
      }
      blockchainResources.initialized = true;
    }
  }
  catch (e) {
    throw e;
  }
}

export async function resetBlockchainObjects() {
  blockchainResources = {
    approvedNetwork: false,
    networkId: 0,
    // @ts-ignore
    signer: undefined,
  };
}

export async function signMessage(message: string) {
  try {
    const data = ethers.utils.toUtf8Bytes(message);
    const signer = blockchainResources.signer;
    const sig = await signer.signMessage(data)
    return sig;
  }
  catch (e) {
    throw e;
  }
}

export async function verifySignature(message: string, signature: string) {
  try {
    const result = await ethers.utils.verifyMessage(message, signature);
    return result;
  }
  catch (e) {
    throw e;
  }
}

export async function getBlockchainObjects(): Promise<BlockchainResources> {
  try {
    if (!blockchainResources.signer) {
      await initBlockchainResources();
    } else {
      await fetchFromWindow();
    }
    return blockchainResources;
  }
  catch (e) {
    throw e;
  }
}

export async function getGasPrice() {
  let priceData = await (await fetch("https://ethgasstation.info/json/ethgasAPI.json")).json();
  return ethers.utils.parseUnits(`${(priceData.average / 10) + 1.5}`, 'gwei'); // This adds 1 Gwei to the average for a safe fast action
}
