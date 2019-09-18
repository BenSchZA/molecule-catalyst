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
    marketSettingsStress,
    moleculeVaultSettings,
    marketSettings,
    MarketAbi,
    VaultAbi,
    defaultDaiPurchase,
    defaultTokenVolume,
    purchasingSequences
 } = require("../testing.settings.js");

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
        for(let i = 3; i < 10; i++){
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
        it("Round roll over tests", async () => {
            let mintAmount = ethers.utils.parseUnits("10000", 18);

            let phaseOne = await vaultInstance.fundingPhase(0);
            let phaseTwo = await vaultInstance.fundingPhase(1);
            let phaseThree = await vaultInstance.fundingPhase(2);
            let balanceVault = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            let balanceMarket = await pseudoDaiInstance.balanceOf(marketInstance.contract.address);

            assert.equal(balanceVault.toString(), 0, "Vault has pre-existing funding");
            assert.equal(balanceMarket.toString(), 0, "Market has pre-existing funds");
            // Round 1 checks
            assert.equal(phaseOne[0].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Funding threshold incorrect");
            assert.equal(phaseOne[1].toString(), 0, "Round funding raised incorrect");
            assert.equal(phaseOne[4].toString(), 1, "Round state is incorrect");
            // Round 2 checks
            assert.equal(phaseTwo[0].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Funding threshold incorrect");
            assert.equal(phaseTwo[1].toString(), 0, "Round funding raised incorrect");
            assert.equal(phaseTwo[4].toString(), 0, "Round state is incorrect");
            // Round 3 checks
            assert.equal(phaseThree[0].toString(), marketSettingsStress.fundingGoalsWithTax[2].toString(), "Funding threshold incorrect");
            assert.equal(phaseThree[1].toString(), 0, "Round funding raised incorrect");
            assert.equal(phaseThree[4].toString(), 0, "Round state is incorrect");

            await (await marketInstance.from(user1).mint(user1.signer.address, mintAmount)).wait();

            balanceVault = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            balanceMarket = await pseudoDaiInstance.balanceOf(marketInstance.contract.address);

            let phaseOneM1 = await vaultInstance.fundingPhase(0);
            let phaseTwoM1 = await vaultInstance.fundingPhase(1);
            let phaseThreeM1 = await vaultInstance.fundingPhase(2);

            assert.equal(balanceVault.toString(), marketSettingsStress.vaultBalances[0], "Vault balance incorrect");
            assert.equal(balanceMarket.toString(), marketSettingsStress.marketBalances[0], "Market balance incorrect");
            // Round 1 checks
            assert.equal(phaseOneM1[0].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Funding threshold incorrect");
            assert.equal(phaseOneM1[1].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Round funding raised incorrect");
            assert.equal(phaseOneM1[4].toString(), 2, "Round state is incorrect");
            // Round 2 checks
            assert.equal(phaseTwoM1[0].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Funding threshold incorrect");
            assert.equal(phaseTwoM1[1].toString(), marketSettingsStress.rollOverAmounts[0], "Round funding raised incorrect");
            assert.equal(phaseTwoM1[4].toString(), 1, "Round state is incorrect");
            // Round 3 checks
            assert.equal(phaseThreeM1[0].toString(), marketSettingsStress.fundingGoalsWithTax[2].toString(), "Funding threshold incorrect");
            assert.equal(phaseThreeM1[1].toString(), 0, "Round funding raised incorrect");
            assert.equal(phaseThreeM1[4].toString(), 0, "Round state is incorrect");

            mintAmount = ethers.utils.parseUnits("20000", 18);

            await (await marketInstance.from(user1).mint(user1.signer.address, mintAmount)).wait();

            balanceVault = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            balanceMarket = await pseudoDaiInstance.balanceOf(marketInstance.contract.address);

            let phaseOneM2 = await vaultInstance.fundingPhase(0);
            let phaseTwoM2 = await vaultInstance.fundingPhase(1);
            let phaseThreeM2 = await vaultInstance.fundingPhase(2);

            assert.equal(balanceVault.toString(), marketSettingsStress.vaultBalances[1], "Vault balance incorrect");
            assert.equal(balanceMarket.toString(), marketSettingsStress.marketBalances[1], "Market balance incorrect");
            // Round 1 checks
            assert.equal(phaseOneM2[0].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Funding threshold incorrect");
            assert.equal(phaseOneM2[1].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Round funding raised incorrect");
            assert.equal(phaseOneM2[4].toString(), 2, "Round state is incorrect");
            // Round 2 checks
            assert.equal(phaseTwoM2[0].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Funding threshold incorrect");
            assert.equal(phaseTwoM2[1].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Round funding raised incorrect");
            assert.equal(phaseTwoM2[4].toString(), 2, "Round state is incorrect");
            // Round 3 checks
            assert.equal(phaseThreeM2[0].toString(), marketSettingsStress.fundingGoalsWithTax[2].toString(), "Funding threshold incorrect");
            assert.equal(phaseThreeM2[1].toString(), marketSettingsStress.rollOverAmounts[1], "Round funding raised incorrect");
            assert.equal(phaseThreeM2[4].toString(), 1, "Round state is incorrect");

            mintAmount = ethers.utils.parseUnits("30000", 18);

            await (await marketInstance.from(user1).mint(user1.signer.address, mintAmount)).wait();

            balanceVault = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            balanceMarket = await pseudoDaiInstance.balanceOf(marketInstance.contract.address);

            let phaseOneM3 = await vaultInstance.fundingPhase(0);
            let phaseTwoM3 = await vaultInstance.fundingPhase(1);
            let phaseThreeM3 = await vaultInstance.fundingPhase(2);

            assert.equal(balanceVault.toString(), marketSettingsStress.vaultBalances[2], "Vault balance incorrect");
            assert.equal(balanceMarket.toString(), marketSettingsStress.marketBalances[2], "Market balance incorrect");
            // Round 1 checks
            assert.equal(phaseOneM3[0].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Funding threshold incorrect");
            assert.equal(phaseOneM3[1].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Round funding raised incorrect");
            assert.equal(phaseOneM3[4].toString(), 2, "Round state is incorrect");
            // Round 2 checks
            assert.equal(phaseTwoM3[0].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Funding threshold incorrect");
            assert.equal(phaseTwoM3[1].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Round funding raised incorrect");
            assert.equal(phaseTwoM3[4].toString(), 2, "Round state is incorrect");
            // Round 3 checks
            assert.equal(phaseThreeM3[0].toString(), marketSettingsStress.fundingGoalsWithTax[2].toString(), "Funding threshold incorrect");
            assert.equal(phaseThreeM3[1].toString(), marketSettingsStress.fundingGoalsWithTax[2].toString(), "Round funding raised incorrect");
            assert.equal(phaseThreeM3[4].toString(), 2, "Round state is incorrect");

            // TODO after automating market end, add tests here 
        });

        it("Round rollover and withdraw tests", async () => {
            let mintAmount = ethers.utils.parseUnits("10000", 18);
            let phaseOne = await vaultInstance.fundingPhase(0);
            let phaseTwo = await vaultInstance.fundingPhase(1);
            let phaseThree = await vaultInstance.fundingPhase(2);
            let balanceVault = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            let balanceMarket = await pseudoDaiInstance.balanceOf(marketInstance.contract.address); 
            let balanceMolVault = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);

            assert.equal(balanceMolVault.toString(), 0, "Mol vault has pre-existing funds");
            assert.equal(balanceVault.toString(), 0, "Vault has pre-existing funding");
            assert.equal(balanceMarket.toString(), 0, "Market has pre-existing funds");
            // Round 1 checks
            assert.equal(phaseOne[0].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Funding threshold incorrect");
            assert.equal(phaseOne[1].toString(), 0, "Round funding raised incorrect");
            assert.equal(phaseOne[4].toString(), 1, "Round state is incorrect");
            // Round 2 checks
            assert.equal(phaseTwo[0].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Funding threshold incorrect");
            assert.equal(phaseTwo[1].toString(), 0, "Round funding raised incorrect");
            assert.equal(phaseTwo[4].toString(), 0, "Round state is incorrect");
            // Round 3 checks
            assert.equal(phaseThree[0].toString(), marketSettingsStress.fundingGoalsWithTax[2].toString(), "Funding threshold incorrect");
            assert.equal(phaseThree[1].toString(), 0, "Round funding raised incorrect");
            assert.equal(phaseThree[4].toString(), 0, "Round state is incorrect");

            await (await marketInstance.from(user1).mint(user1.signer.address, mintAmount)).wait();

            let balanceVaultM1 = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            let balanceMarketM1 = await pseudoDaiInstance.balanceOf(marketInstance.contract.address);
            let balanceOfCreatorM1 = await pseudoDaiInstance.balanceOf(creator.signer.address);
            let phaseOneM1 = await vaultInstance.fundingPhase(0);
            let phaseTwoM1 = await vaultInstance.fundingPhase(1);
            let phaseThreeM1 = await vaultInstance.fundingPhase(2);

            assert.equal(balanceVaultM1.toString(), marketSettingsStress.vaultBalances[0], "Vault balance incorrect");
            assert.equal(balanceMarketM1.toString(), marketSettingsStress.marketBalances[0], "Market balance incorrect");
            assert.equal(balanceOfCreatorM1.toString(), 0, "Creator has pre-existing funds")
            // Round 1 checks
            assert.equal(phaseOneM1[0].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Funding threshold incorrect");
            assert.equal(phaseOneM1[1].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Round funding raised incorrect");
            assert.equal(phaseOneM1[4].toString(), 2, "Round state is incorrect");
            // Round 2 checks
            assert.equal(phaseTwoM1[0].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Funding threshold incorrect");
            assert.equal(phaseTwoM1[1].toString(), marketSettingsStress.rollOverAmounts[0].toString(), "Round funding raised incorrect");
            assert.equal(phaseTwoM1[4].toString(), 1, "Round state is incorrect");
            // Round 3 checks
            assert.equal(phaseThreeM1[0].toString(), marketSettingsStress.fundingGoalsWithTax[2].toString(), "Funding threshold incorrect");
            assert.equal(phaseThreeM1[1].toString(), 0, "Round funding raised incorrect");
            assert.equal(phaseThreeM1[4].toString(), 0, "Round state is incorrect");

            // Withdrawing the funding from round 1
            await vaultInstance.from(creator).withdraw(0);
            let balanceVaultW1 = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            let balanceMolVaultW1 = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            let balanceOfCreatorW1 = await pseudoDaiInstance.balanceOf(creator.signer.address);

            assert.equal(balanceMolVaultW1.toString(), marketSettingsStress.molVaultBalances[0], "Mol vault balance incorrect");
            assert.equal(balanceVaultW1.toString(), marketSettingsStress.vaultBalanceWithdraws[0], "Vault balance after withdraw incorrect");
            assert.equal(balanceOfCreatorW1.toString(), marketSettingsStress.fundingGoals[0], "Creator received incorrect funding amount");

            mintAmount = ethers.utils.parseUnits("20000", 18);
            await (await marketInstance.from(user1).mint(user1.signer.address, mintAmount)).wait();

            let balanceVaultM2 = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            let balanceOfCreatorM2 = await pseudoDaiInstance.balanceOf(creator.signer.address);
            let phaseOneM2 = await vaultInstance.fundingPhase(0);
            let phaseTwoM2 = await vaultInstance.fundingPhase(1);
            let phaseThreeM2 = await vaultInstance.fundingPhase(2);

            assert.equal(balanceVaultM2.toString(), marketSettingsStress.vaultBalanceWithdraws[1].toString(), "Vault balance incorrect");
            assert.equal(balanceOfCreatorM2.toString(), marketSettingsStress.fundingGoals[0].toString());
            // Round 1 checks
            assert.equal(phaseOneM2[0].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Funding threshold incorrect");
            assert.equal(phaseOneM2[1].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Round funding raised incorrect");
            assert.equal(phaseOneM2[4].toString(), 3, "Round state is incorrect");
            // Round 2 checks
            assert.equal(phaseTwoM2[0].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Funding threshold incorrect");
            assert.equal(phaseTwoM2[1].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Round funding raised incorrect");
            assert.equal(phaseTwoM2[4].toString(), 2, "Round state is incorrect");
            // Round 3 checks
            assert.equal(phaseThreeM2[0].toString(), marketSettingsStress.fundingGoalsWithTax[2].toString(), "Funding threshold incorrect");
            assert.equal(phaseThreeM2[1].toString(), marketSettingsStress.rollOverAmounts[1], "Round funding raised incorrect");
            assert.equal(phaseThreeM2[4].toString(), 1, "Round state is incorrect");

            await vaultInstance.from(creator).withdraw(1);

            let balanceVaultW2 = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            let balanceMolVaultW2 = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            let balanceOfCreatorW2 = await pseudoDaiInstance.balanceOf(creator.signer.address);

            assert.equal(balanceMolVaultW2.toString(), marketSettingsStress.molVaultBalances[1], "Mol vault balance incorrect");
            assert.equal(balanceVaultW2.toString(), marketSettingsStress.vaultBalanceWithdraws[2], "Vault balance incorrect");
            assert.equal(balanceOfCreatorW2.toString(), marketSettingsStress.creatorBalances[1].toString(), "Creator does not have correct balance after withdraw");

            mintAmount = ethers.utils.parseUnits("30000", 18);
            await (await marketInstance.from(user1).mint(user1.signer.address, mintAmount)).wait();
            let balanceVaultM3 = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);

            assert.equal(balanceVaultM3.toString(), marketSettingsStress.vaultBalanceWithdraws[3], "Vault balance incorrect");

            await vaultInstance.from(creator).withdraw(2);

            let balanceVaultW3 = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            let balanceMolVaultW3 = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            let balanceOfCreatorW3 = await pseudoDaiInstance.balanceOf(creator.signer.address);
            let phaseOneM3 = await vaultInstance.fundingPhase(0);
            let phaseTwoM3 = await vaultInstance.fundingPhase(1);
            let phaseThreeM3 = await vaultInstance.fundingPhase(2);

            assert.equal(balanceMolVaultW3.toString(), marketSettingsStress.molVaultBalances[2], "Mol vault balance incorrect");
            assert.equal(balanceVaultW3.toString(), 0, "Vault has remaining funds");
            assert.equal(balanceOfCreatorW3.toString(), marketSettingsStress.creatorBalances[2].toString(), "Creator balance incorrect");
            // Round 1 checks
            assert.equal(phaseOneM3[0].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Funding threshold incorrect");
            assert.equal(phaseOneM3[1].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Round funding raised incorrect");
            assert.equal(phaseOneM3[4].toString(), 3, "Round state is incorrect");
            // Round 2 checks
            assert.equal(phaseTwoM3[0].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Funding threshold incorrect");
            assert.equal(phaseTwoM3[1].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Round funding raised incorrect");
            assert.equal(phaseTwoM3[4].toString(), 3, "Round state is incorrect");
            // Round 3 checks
            assert.equal(phaseThreeM3[0].toString(), marketSettingsStress.fundingGoalsWithTax[2].toString(), "Funding threshold incorrect");
            assert.equal(phaseThreeM3[1].toString(), marketSettingsStress.fundingGoalsWithTax[2].toString(), "Round funding raised incorrect");
            assert.equal(phaseThreeM3[4].toString(), 3, "Round state is incorrect");
        });

        it("Multiple rounds being bought at once", async () => {
            let currentPhase = await vaultInstance.currentPhase();
            assert.equal(currentPhase.toString(), 0, "Phase invalid");
            
            let phaseOne = await vaultInstance.fundingPhase(0);
            let phaseTwo = await vaultInstance.fundingPhase(1);
            let phaseThree = await vaultInstance.fundingPhase(2);

            assert.equal(phaseOne[1].toString(), 0, "Round has pre-existing funds");
            assert.equal(phaseOne[4].toString(), 1, "Round has not started");
            assert.equal(phaseTwo[1].toString(), 0, "Round has pre-existing funds");
            assert.equal(phaseTwo[4].toString(), 0, "Round state is incorrect");
            assert.equal(phaseThree[1].toString(), 0, "Round has pre-existing funds");
            assert.equal(phaseThree[4].toString(), 0, "Round state is incorrect");

            let estimateTokens = await marketInstance.collateralToTokenBuying(ethers.utils.parseUnits("30000", 18));
            // Making a purchase that ends multiple rounds
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            currentPhase = await vaultInstance.currentPhase();
            let phaseOneM1 = await vaultInstance.fundingPhase(0);
            let phaseTwoM1 = await vaultInstance.fundingPhase(1);
            let phaseThreeM1 = await vaultInstance.fundingPhase(2);
            
            assert.equal(phaseOneM1[1].toString(), marketSettingsStress.fundingGoalsWithTax[0].toString(), "Funding collected is larger than round");
            assert.equal(phaseOneM1[4].toString(), 2, "Round has not ended");
            assert.equal(phaseTwoM1[1].toString(), marketSettingsStress.fundingGoalsWithTax[1].toString(), "Funding collected is larger than round");
            assert.equal(phaseTwoM1[4].toString(), 2, "Round has not ended");
            assert.equal(phaseThreeM1[1].toString(), marketSettingsStress.remainingFunding, "Round funding incorrect");
            assert.equal(phaseThreeM1[4].toString(), 1, "Round state is incorrect");
            assert.equal(currentPhase.toString(), 2, "Phase invalid");
        });

        it("Blocks minting if too much time has passed", async () => {
            let currentPhase = await vaultInstance.currentPhase();
            assert.equal(currentPhase.toString(), 0, "Phase invalid");
            
            // Making a purchase that doesn't end the round
            let phaseData = await vaultInstance.fundingPhase(0);
            let estimateTokens = await marketInstance.collateralToTokenBuying(ethers.utils.parseUnits("500", 18))
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            currentPhase = await vaultInstance.currentPhase();
            
            assert.equal(currentPhase.toString(), 0, "Phase invalid");
            
            // Progressing time past the targeted date
            const exceedtime = constants.monthInSeconds*(marketSettings.phaseDuration[0] + 1);
            await utils.timeTravel(deployer.provider, exceedtime);
            
            estimateTokens = await marketInstance.collateralToTokenBuying(ethers.utils.parseUnits("500", 18))
            await assert.revert(marketInstance.from(user1).mint(user1.signer.address, estimateTokens), "Mint was allowed incorrectly")
        });
    });
});