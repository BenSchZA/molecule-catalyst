require('dotenv').config();
DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const etherlime = require('etherlime-lib');
//const LimeFactory = require('../build/LimeFactory.json');


const PseudoDaiABI = require('../build/PseudoDaiToken.json');

const MoleculeVaultABI = require('../build/MoleculeVault.json');

const CurveFunctionsABI = require('../build/CurveFunctions.json');
const CurveRegistryABI = require('../build/CurveRegistry.json');
const MarketRegistryABI = require('../build/MarketRegistry.json');
const MarketFactoryABI = require('../build/MarketFactory.json');

const defaultConfigs = {
  gasPrice: 1000000000,
  gasLimit: 4700000,
  chainId: 4,
  etherscanApiKey: process.env.ETHERSCAN_API_KEY,
};

const deploy = async (network, secret) => {
  if(!secret) {
    secret = DEPLOYER_PRIVATE_KEY;
  }

  const deployer = new etherlime.JSONRPCPrivateKeyDeployer(secret, 'http://localhost:8545/', defaultConfigs);
  //const deployer = new etherlime.EtherlimeGanacheDeployer();

  const deploy = (...args) => deployer.deployAndVerify(...args);

  const pseudoDaiInstance = await deploy(
    PseudoDaiABI,
    false,
    "PseudoDai",
    "pDAI",
    18
  );

  const moleculeVaultInstance = await deploy(
    MoleculeVaultABI,
    false,
    pseudoDaiInstance.contract.address,
    15
  );

  const curveFunctionsInstance = await deploy(CurveFunctionsABI);
  const curveRegistryInstance = await deploy(CurveRegistryABI);
  const registerCurveTX = await curveRegistryInstance.registerCurve(
    curveFunctionsInstance.contract.address,
    "linear: (1/20000)*x + 0.5"
  );
  let result = await curveRegistryInstance.verboseWaitForTransaction(registerCurveTX, 'Register curve');

  const marketRegistryInstance = await deploy(MarketRegistryABI);
  const marketFactoryInstance = await deploy(
    MarketFactoryABI,
    false,
    pseudoDaiInstance.contract.address,
    moleculeVaultInstance.contract.address,
    marketRegistryInstance.contract.address,
    curveRegistryInstance.contract.address
  );

  const addMarketDeployerTX = await marketRegistryInstance.addMarketDeployer(
    marketFactoryInstance.contract.address,
    "Debug logs/version"
  );
  await marketRegistryInstance.verboseWaitForTransaction(addMarketDeployerTX, 'Add market deployer');

  const CONTRACT_ADDRESSES = `
  PDAI_CONTRACT_ADDRESS=${pseudoDaiInstance.contract.address}
  MARKET_REGISTRY_ADDRESS=${marketRegistryInstance.contract.address}
  MARKET_FACTORY_ADDRESS=${marketFactoryInstance.contract.address}`;
  console.log(CONTRACT_ADDRESSES);
};

module.exports = {
  deploy
};
