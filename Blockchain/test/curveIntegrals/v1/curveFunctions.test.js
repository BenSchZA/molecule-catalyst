const {
  PseudoDaiTokenAbi,
  MoleculeVaultAbi,
  MarketRegistryAbi,
  CurveRegistryAbi,
  CurveFunctionsAbi,
  MarketFactoryAbi,
  ethers,
  etherlime,
  daiSettings,
  moleculeVaultSettings,
  marketSettings,
  MarketAbi,
  VaultAbi,
  defaultDaiPurchase,
  defaultTokenVolume,
  purchasingSequences,
  simulatedCurve
} = require("../../testing.settings.js");

describe('Curve Functions test', () => {
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

  it('Curve Integral functions as expected', async () => {
    console.log("\tCurve checks");
    const rawDaiBN = await curveFunctionsInstance.from(molAdmin)
      .curveIntegral(simulatedCurve.defaultPurchaseAmount)
    assert.equal(
      ethers.utils.formatUnits(rawDaiBN, 18),
      50.285714285714285,
      "Calculation incorrect"
    )
  });

  it('Inverse Curve Integral functions as expected', async () => {
    const rawDaiBN = await curveFunctionsInstance.from(molAdmin)
      .curveIntegral(simulatedCurve.defaultPurchaseAmount)
    const rawTokenBN = await curveFunctionsInstance.from(molAdmin)
      .inverseCurveIntegral(rawDaiBN)
    assert.equal(
      ethers.utils.formatUnits(rawTokenBN, 18),
      99.999999999999982499,
      "Calculation incorrect"
    )
  });
})
