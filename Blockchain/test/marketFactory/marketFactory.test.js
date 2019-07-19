const etherlime = require('etherlime-lib');
const ethers = require('ethers');

let Market = require('../../../build/Market.json');
let PseudoDaiToken = require('../../../build/PseudoDaiToken.json');
let MoleculeVault = require('../../../build/MoleculeVault.json');
let CurveRegistry = require('../../../build/CurveRegistry.json');
let MarketRegistry = require('../../../build/MarketRegistry.json');
let MarketFactory = require('../../../build/MarketFactory.json');
// let BondingFunctions = require('../../../build/Market.json');

describe('Curve Registry test', () => {
    let deployer;
    let molAdmin = accounts[0];
    let userAccount = accounts[1];
    let marketInstance;
    let pseudoDaiTokenInstance;
    let moleculeVaultInstance;
    let curveRegistryInstance;
    let marketRegistryInstance;
    let marketFactoryInstance;
  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(molAdmin.secretKey);

        pseudoDaiTokenInstance = await deployer.deploy(
            PseudoDaiToken,
            false
        );
        moleculeVaultInstance = await deployer.deploy(
            MoleculeVault,
            false
        );
        marketRegistryInstance = await deployer.deploy(
            MarketRegistry,
            false,
        );
        marketInstance = await deployer.deploy(
            Market,
            false
        );
        curveRegistryInstance = await deployer.deploy(
            CurveRegistry,
            false
        );
        // vyper = await deployer.deploy(
        //     BondingFunctions,
        //     false
        // );
        // TODO: register vyper curve
        marketFactoryInstance = await deployer.deploy(
            MarketFactory,
            false,
            pseudoDaiTokenInstance.contract.address,
            moleculeVaultInstance.contract.address,
            marketRegistryInstance.contract.address,
            curveRegistryInstance.contract.address
        );
    });

    describe('Admin functions', async () => {
        it('Registers a curve');
        it('Deactivates a curve');
        it('Activates a curve');
    });

    describe('Meta data', async () =>{
        it('Get curve address by index');
        it('Get curve data by index');
        it('Get index');
        it('Published Block number');

    })
})
