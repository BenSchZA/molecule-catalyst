const { PseudoDaiTokenAbi, MoleculeVaultAbi, MarketRegistryAbi, CurveRegistryAbi, CurveFunctionsAbi, MarketFactoryAbi, ethers, etherlime, daiSettings, moleculeVaultSettings } = require("../testing.settings.js");

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

    describe('Curve checks', () => {
        it('Curve Integral functions as expected', async () => {
            const rawDaiBN = await curveFunctionsInstance.from(molAdmin)
                .curveIntegral(simulatedCurve.defaultPurchaseAmount, simulatedCurve.gradientDenominator, simulatedCurve.scaledShift)
            assert.equal(
                ethers.utils.formatUnits(rawDaiBN, 18),
                50.285714,
                "Calculation incorrect"
            )
        });

        it('Inverse Curve Integral functions as expected', async () =>{
            const rawDaiBN = await curveFunctionsInstance.from(molAdmin)
                .curveIntegral(simulatedCurve.defaultPurchaseAmount, simulatedCurve.gradientDenominator, simulatedCurve.scaledShift)
            const rawTokenBN = await curveFunctionsInstance.from(molAdmin)
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
