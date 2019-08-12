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
  gasLimit: 4700000
};

const deploy = async (network, secret) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();

  const pseudoDaiInstance = await deployer.deploy(
    PseudoDaiABI,
    false,
    "PseudoDai",
    "pDAI",
    18
  );

  const moleculeVaultInstance = await deployer.deploy(
    MoleculeVaultABI,
    false,
    pseudoDaiInstance.contract.address,
    15,
    deployer.signer.address
  );

  const curveFunctionsInstance = await deployer.deploy(CurveFunctionsABI);
  const curveRegistryInstance = await deployer.deploy(CurveRegistryABI);
  const registerCurveTX = await curveRegistryInstance.registerCurve(
    curveFunctionsInstance.contract.address,
    "linear: (1/17500)*x + 0.5"
  );
  let result = await curveRegistryInstance.verboseWaitForTransaction(registerCurveTX, 'Register curve');

  const marketRegistryInstance = await deployer.deploy(MarketRegistryABI);
  const marketFactoryInstance = await deployer.deploy(
    MarketFactoryABI,
    false,
    pseudoDaiInstance.contract.address,
    moleculeVaultInstance.contract.address,
    marketRegistryInstance.contract.address,
    curveRegistryInstance.contract.address
  );

};

module.exports = {
	deploy
};
