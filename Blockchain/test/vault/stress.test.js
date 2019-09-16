const { 
    PseudoDaiTokenAbi,
    MoleculeVaultAbi, 
    MarketRegistryAbi, 
    CurveRegistryAbi, 
    CurveFunctionsAbi, 
    MarketFactoryAbi, 
    ethers, 
    etherlime, 
    constants,
    daiSettings,
    moleculeVaultSettings,
    marketSettings,
    MarketAbi,
    VaultAbi,
    defaultDaiPurchase,
    defaultTokenVolume,
    purchasingSequences
 } = require("../testing.settings.js");

let marketSettingsStress = {
    fundingGoals: [
        ethers.utils.parseUnits("5000000", 18),
        ethers.utils.parseUnits("4000000", 18),
        ethers.utils.parseUnits("3000000", 18)
    ],
    phaseDuration: [
        ethers.utils.parseUnits("1", 0),
        ethers.utils.parseUnits("1", 0),
        ethers.utils.parseUnits("1", 0)
    ],
    curveType: ethers.utils.parseUnits("0", 0),
    taxationRate: ethers.utils.parseUnits("15", 0)
}

describe('Vault stress test', async () => {
    let molAdmin = accounts[1];
    let creator = accounts[2];
    let user1 = accounts[3];
    let user2 = accounts[4];
    let admin2 = accounts[5];
    let pseudoDaiInstance, moleculeVaultInstance, curveRegistryInstance, marketRegistryInstance, marketFactoryInstance, curveIntegralInstance;

    let marketInstance, vaultInstance;

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
            moleculeVaultSettings.taxationRate
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
            "linear: (1/20000)*x + 0.5"
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

        // Creating a market
        await (await marketFactoryInstance.from(molAdmin).deployMarket(
            marketSettingsStress.fundingGoals,
            marketSettingsStress.phaseDuration,
            creator.signer.address,
            marketSettingsStress.curveType,
            marketSettingsStress.taxationRate
        )).wait()

        const firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
        
        marketInstance = await etherlime.ContractAt(MarketAbi, firstMarketDataObj[0]);
        vaultInstance = await etherlime.ContractAt(VaultAbi, firstMarketDataObj[1]);

        
        // Setting up dai
        for(let i = 0; i < 10; i++){
            // Getting tokens
            await (await pseudoDaiInstance.from(accounts[i]).mint());
            // Setting approval
            await (await pseudoDaiInstance.from(accounts[i]).approve(
                marketInstance.contract.address,
                ethers.constants.MaxUint256
            ))
        }
    });

    describe("Multiple round testing", async () => {
        it("Mints specified token amount", async () => {
            let mintAmount = ethers.utils.parseUnits("1500000", 18);
            // Minting tokens (not enough to finish round)
            console.log("0")
            await (await marketInstance.from(user1).mint(user1.signer.address, mintAmount)).wait();
            console.log("0")
            await (await marketInstance.from(user2).mint(user2.signer.address, mintAmount)).wait();
            // Getting the phase data from the vault
            let phaseData = await vaultInstance.fundingPhase(0);
            console.log(phaseData[0].toString())
            console.log(phaseData[2].toString())
            console.log(phaseData[2].toString())
            console.log(phaseData[4].toString())
            // Time jumping to end the round
            const exceedTime = constants.monthInSeconds*(marketSettingsStress.phaseDuration[0] + 1);
            await utils.timeTravel(deployer.provider, exceedTime);

            // Checking withdraws are correct
            phaseData = await vaultInstance.fundingPhase(0);
            console.log(phaseData[0].toString())
            console.log(phaseData[2].toString())
            console.log(phaseData[2].toString())
            console.log(phaseData[4].toString())

            await assert.revert(marketInstance.from(user1).mint(user1.signer.address, mintAmount), "Mint was allowed incorrectly");

            await (await vaultInstance.from(creator).terminateMarket()).wait();
            phaseData = await vaultInstance.fundingPhase(0);
            console.log(phaseData[0].toString())
            console.log(phaseData[2].toString())
            console.log(phaseData[2].toString())
            console.log(phaseData[4].toString())

            const marketActivity = await marketInstance.active();
            console.log("0")
            assert.equal(marketActivity, false, "Market is still active");
            console.log("0")
            let balanceOfUser1 = await pseudoDaiInstance.balanceOf(user1.signer.address);
            let balanceOfUser2 = await pseudoDaiInstance.balanceOf(user2.signer.address);
            console.log("0")
            await (await marketInstance.from(user1.signer.address, mintAmount).withdraw(balanceOfUser1)).wait();
            await (await marketInstance.from(user2.signer.address, mintAmount).withdraw(balanceOfUser2)).wait();
            console.log("0")
            let balanceOfUser1After = await pseudoDaiInstance.balanceOf(user1.signer.address);
            let balanceOfUser2After = await pseudoDaiInstance.balanceOf(user2.signer.address);

            console.log(balanceOfUser1)
            console.log(balanceOfUser2)
            console.log(balanceOfUser1After)
            console.log(balanceOfUser2After)
            
        });

        it("Blocks minting if too much time has passed", async () => {
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");
            
            // Making a purchase that doesn't end the round
            let phaseData = await vaultInstance.fundingPhase(0);
            let estimateTokens = await marketInstance.collateralToTokenBuying(ethers.utils.parseUnits("50000", 18))
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            currentPhase = await vaultInstance.currentPhase();
            
            assert.ok(currentPhase.eq(0), "Phase invalid");
            
            // Progressing time past the targeted date
            const exceedtime = constants.monthInSeconds*(marketSettings.phaseDuration[0] + 1);
            await utils.timeTravel(deployer.provider, exceedtime);
            
            estimateTokens = await marketInstance.collateralToTokenBuying(ethers.utils.parseUnits("50000", 18))
            await assert.revert(marketInstance.from(user1).mint(user1.signer.address, estimateTokens), "Mint was allowed incorrectly")
        });
    });
});