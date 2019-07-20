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


describe('Curve Integral test', () => {
    let molAdmin = accounts[1];
    let creator = accounts[2];
    let user1 = accounts[3];
    let user2 = accounts[4];
    let pseudoDaiInstance, moleculeVaultInstance, curveRegistryInstance, marketRegistryInstance, marketFactoryInstance, curveIntegralInstance;

  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(molAdmin.secretKey);

        curveFunctionsInstance = await deployer.deploy(
            CurveFunctionsAbi,
            false
        );

    });

    describe('Curve checks', async () => {
        it('Curve Integral functions as expected', async () => {
            const rawDaiBN = await curveFunctionsInstance.from(userAccount)
                .curveIntegral(simulatedCurve.defaultPurchaseAmount, simulatedCurve.gradientDenominator, simulatedCurve.scaledShift)
            assert.equal(
                ethers.utils.formatUnits(rawDaiBN, 18),
                50.285714,
                "Calculation incorrect"
            )
        });

        it('Inverse Curve Integral functions as expected', async () =>{
            const rawDaiBN = await curveFunctionsInstance.from(userAccount)
                .curveIntegral(simulatedCurve.defaultPurchaseAmount, simulatedCurve.gradientDenominator, simulatedCurve.scaledShift)
            const rawTokenBN = await curveFunctionsInstance.from(userAccount)
                .inverseCurveIntegral(
                    rawDaiBN, 
                    simulatedCurve.gradientDenominator, 
                    simulatedCurve.scaledShift
                )
            assert.equal(
              ethers.utils.formatUnits(rawTokenBN, 18),
              99.9999982499,
              "Calculation incorrect"
            )
        });
        
    });
})
