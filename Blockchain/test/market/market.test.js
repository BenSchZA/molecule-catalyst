const etherlime = require('etherlime-lib');
const ethers = require('ethers');

var PseudoDaiToken = require('../../build/PseudoDaiToken.json');
let BondingFunctions = require('../../build/BondingFunctions.json');

const defaultDaiPurchase = 500;
const defaultTokenVolume = 100;

const marketInitSettings = {
    taxationRate: 60,
    creatorVault: "0x",
    curveLibrary: "0x",
    collateralToken: "0x"
}

const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

describe('Market test', () => {
    let deployer;
    let molAdmin = accounts[0];
    let userAccount = accounts[1];
    let bondingFunctionsInstance;
  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(molAdmin.secretKey);

        pseudoDaiInstance = await deployer.deploy(
            PseudoDaiToken, 
            false, 
            daiSettings.name, 
            daiSettings.symbol, 
            daiSettings.decimals
        );

        bondingFunctionsInstance = await deployer.deploy(
            BondingFunctions,
            false
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
