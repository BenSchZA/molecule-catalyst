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
    purchasingSequences
 } = require("../testing.settings.js");
 
// The before each should deploy in this order:
describe("Market Factory test", async () => {
    let molAdmin = accounts[1];
    let creator = accounts[2];
    let user1 = accounts[3];
    let user2 = accounts[4];
    let pseudoDaiInstance, moleculeVaultInstance, curveRegistryInstance, marketRegistryInstance, marketFactoryInstance, curveIntegralInstance;

    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(molAdmin.secretKey);

        pseudoDaiInstance = await deployer.deploy(
            PseudoDaiTokenAbi, 
            false, 
            daiSettings.name, 
            daiSettings.symbol, 
            daiSettings.decimals
        );

        moleculeVaultInstance = await deployer.deploy(
            MoleculeVaultAbi,
            false,
            pseudoDaiInstance.contract.address,
            moleculeVaultSettings.taxationRate,
            molAdmin.signer.address
        );

        marketRegistryInstance = await deployer.deploy(
            MarketRegistryAbi,
            false,
        );

        curveRegistryInstance = await deployer.deploy(
            CurveRegistryAbi,
            false
        );

        curveIntegralInstance = await deployer.deploy(
            CurveFunctionsAbi,
            false
        );

        await( await curveRegistryInstance.from(molAdmin).registerCurve(
            curveIntegralInstance.contract.address,
            "y-axis shift"
        )).wait();

        marketFactoryInstance = await deployer.deploy(
            MarketFactoryAbi,
            false,
            pseudoDaiInstance.contract.address,
            moleculeVaultInstance.contract.address,
            marketRegistryInstance.contract.address,
            curveRegistryInstance.contract.address
        );

        await (await marketRegistryInstance.from(molAdmin).addMarketDeployer(marketFactoryInstance.contract.address, "Initial factory")).wait()
    });

    describe("Admin functions", async () => {
        it('Deploys a compound ecosystem', async () => {
            let firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.equal(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.equal(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], ethers.constants.AddressZero, "Contract registry creator incorrect")
            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                    marketSettings.fundingGoals,
                    marketSettings.phaseDuration,
                    creator.signer.address,
                    marketSettings.curveType,
                    marketSettings.taxationRate
                )).wait()
            firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.notEqual(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.notEqual(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], creator.signer.address, "Contract registry creator incorrect")
        });
    });

    describe("Meta data", async () => {
        it('moleculeVault', async () => {
            // console.log(moleculeVaultInstance);
            console.log("  xxx Market Factory - No mol vault functions work");
            let test = await moleculeVaultInstance.from(molAdmin).collateralToken();
            // 0xDEa9F30B1593aC9f780f2ce69E51eF218f34B168
            // 0xDEa9F30B1593aC9f780f2ce69E51eF218f34B168
            console.log(">>>>>>>>>>>>>>>> " + test);
            const moleculeVault = await marketFactoryInstance.from(molAdmin).moleculeVault();
            assert.equal(moleculeVault, moleculeVaultInstance.contract.address, "Vault not set correctly")
        });

        it('marketRegistry', async () => {
            const marketRegistry = await marketFactoryInstance.from(molAdmin).marketRegistry();
            assert.equal(marketRegistry, marketRegistryInstance.contract.address, "Registry not set correctly")
        });

        it('collateralToken', async () => {
            const collateralToken = await marketFactoryInstance.from(molAdmin).collateralToken();
            assert.equal(collateralToken, pseudoDaiInstance.contract.address, "CollateralToken not set correctly")
        });
    });

    describe("Admin Managed functions", async () => {
        it("Reverts if non admin deploys", async () => {
            await assert.revert(marketFactoryInstance.from(user1).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate
            ));
        });

        it("Only admin can add an admin", async () => {
            await assert.notRevert(marketFactoryInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))
            await assert.revert(marketFactoryInstance.from(user2).addWhitelistAdmin(user1.signer.address))
        });

        it("Only admin can remove an admin", async () =>{
            await assert.notRevert(marketFactoryInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))
            await assert.revert(marketFactoryInstance.from(user2).renounceWhitelistAdmin())

            await assert.notRevert(marketFactoryInstance.from(user1).renounceWhitelistAdmin())
            
        });

        it("Checks if admin", async () =>{
            let adminStatus = await marketFactoryInstance.from(molAdmin).isWhitelistAdmin(user1.signer.address)
            assert.ok(!adminStatus, "Admin status incorrect")
            
            await assert.notRevert(marketFactoryInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))
            
            adminStatus = await marketFactoryInstance.from(molAdmin).isWhitelistAdmin(user1.signer.address)
            assert.ok(adminStatus, "Admin status not updated")
        });
    });
});
