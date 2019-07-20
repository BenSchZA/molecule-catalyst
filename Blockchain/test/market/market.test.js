const etherlime = require('etherlime-lib');
const ethers = require('ethers');


let MarketAbi = require('../../build/Market.json');
let PseudoDaiTokenAbi = require('../../build/PseudoDaiToken.json');
let MoleculeVaultAbi = require('../../build/MoleculeVault.json');
let CurveRegistryAbi = require('../../build/CurveRegistry.json');
let MarketRegistryAbi = require('../../build/MarketRegistry.json');
let MarketFactoryAbi = require('../../build/MarketFactory.json');
let CurveFunctionsAbi = require('../../build/CurveFunctions.json');

// The user accounts are
const defaultDaiPurchase = 500;
const defaultTokenVolume = 100;

const moleculeVaultSettings = {
    taxationRate: ethers.utils.parseUnits("15", 0),
}

const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

let marketSettings = {
    fundingGoals: [
        ethers.utils.parseUnits("2000000"),
        ethers.utils.parseUnits("2500000"),
        ethers.utils.parseUnits("3000000")
    ],
    phaseDuration: [
        ethers.utils.parseUnits("12", 0),
        ethers.utils.parseUnits("8", 0),
        ethers.utils.parseUnits("6", 0)
    ],
    curveType: ethers.utils.parseUnits("0", 0),
    taxationRate: ethers.utils.parseUnits("60", 0),
    scaledShift: ethers.utils.parseUnits("500000000000000000", 0),
    gradientDenominator: ethers.utils.parseUnits("17000", 0),
}

describe('Market test', () => {
    let deployer;
    let molAdmin = accounts[0];
    let userAccount = accounts[1];
    let marketInstance, pseudoDaiInstance;
  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(molAdmin.secretKey);

        pseudoDaiInstance = await deployer.deploy(
            PseudoDaiToken, 
            false, 
            daiSettings.name, 
            daiSettings.symbol, 
            daiSettings.decimals
        );

        marketInstance = await deployer.deploy(
            MarketAbi,
            false
        );

    });

    describe("Pricing functions", () => {
        it("Calculates Dai to Tokens accurately - Mint")
        it("Calculates Dai to Tokens accurately - Burn")
        it("Calculates Token to Dai accurately - Mint")
        it("Calculates Token to Dai accurately - Burn")
    })

    describe("Token exchange", () =>{
        it()
    })

    describe('Meta data', () =>{
        
        it('Get taxationRate');
        it('Get active state');

    })

    describe("ERC20 Functions", () => {
        describe("Controls", () => {
            it("Transfers")
            it("Sets allowance")
            it("Transfers from account")
        })
        describe("Meta data", () => {
            it('Get allowance');
            it('Get totalSupply');
            it('Get balanceOf');
            it('Get poolBalance');
            it('Get decimals');
        })
    })
})
