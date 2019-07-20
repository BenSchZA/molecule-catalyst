const etherlime = require('etherlime-lib');
const ethers = require('ethers');

let BondingFunctions = require('../../build/BondingFunctions.json');

const simulatedCurve = {
    scaledShift: ethers.utils.parseUnits("50", 16), // 0.5
    gradientDenominator: ethers.utils.parseUnits("17500", 0),
    defaultPurchaseAmount: ethers.utils.parseUnits("100", 18),
    init:{
        totalSupply: ethers.utils.parseUnits("0", 18),
    },
    purchased: {
        totalSupply: ethers.utils.parseUnits("100", 18),
    }
}

describe('Curve Integral test', () => {
    let deployer;
    let molAdmin = accounts[0];
    let userAccount = accounts[1];
    let bondingFunctionsInstance;
  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(molAdmin.secretKey);

        bondingFunctionsInstance = await deployer.deploy(
            BondingFunctions,
            false
        );

    });

    describe('Curve checks', async () => {
        it('Curve Integral functions as expected', async () => {
            const rawDaiBN = await bondingFunctionsInstance.from(userAccount)
                .curveIntegral(simulatedCurve.defaultPurchaseAmount, simulatedCurve.gradientDenominator, simulatedCurve.scaledShift)
            assert.equal(
                ethers.utils.formatUnits(rawDaiBN, 18),
                50.285714,
                "Calculation incorrect"
            )
        });

        it('Inverse Curve Integral functions as expected', async () =>{
            const rawDaiBN = await bondingFunctionsInstance.from(userAccount)
                .curveIntegral(simulatedCurve.defaultPurchaseAmount, simulatedCurve.gradientDenominator, simulatedCurve.scaledShift)
            const rawTokenBN = await bondingFunctionsInstance.from(userAccount)
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
