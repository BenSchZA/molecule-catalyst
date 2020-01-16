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
    vaultMarketSettings,
    MarketAbi,
    VaultAbi,
    constants,
    defaultDaiPurchase,
    defaultTokenVolume,
    purchasingSequences
} = require("../testing.settings.js");

const BigNumber = require('bignumber.js');

describe("Vault test", async () => {
    let insecureDeployer = accounts[0];
    let molAdmin = accounts[1];
    let creator = accounts[2];
    let user1 = accounts[3];
    let user2 = accounts[4];
    let admin2 = accounts[5];
    let backendMarketDeployer = accounts[6];
    let pseudoDaiInstance, moleculeVaultInstance, curveRegistryInstance, marketRegistryInstance, marketFactoryInstance, curveIntegralInstance;

    let marketInstance, vaultInstance;

    const DECIMALS = 18;
    const EXPECTED_PRECISION = DECIMALS - 6;
    BigNumber.config({ DECIMAL_PLACES: EXPECTED_PRECISION });
    BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_UP });
  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(insecureDeployer.secretKey);

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
            molAdmin.signer.address,
            moleculeVaultSettings.taxationRate
        );

        marketRegistryInstance = await deployer.deploy(
            MarketRegistryAbi,
            false
        );
        await marketRegistryInstance.from(insecureDeployer).init(molAdmin.signer.address);

        curveRegistryInstance = await deployer.deploy(
            CurveRegistryAbi,
            false
        );
        await curveRegistryInstance.from(insecureDeployer).init(molAdmin.signer.address);

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
        // Adding the admins (in deployment this would be the multsig)
        await marketFactoryInstance.from(insecureDeployer).init(
            molAdmin.signer.address,
            backendMarketDeployer.signer.address
        );
        // Adding the market deployer
        await (await marketRegistryInstance.from(molAdmin).addMarketDeployer(
            marketFactoryInstance.contract.address, "Initial factory"
        )).wait()
        
        // Creating a market
        await (await marketFactoryInstance.from(molAdmin).deployMarket(
            marketSettings.fundingGoals,
            marketSettings.phaseDuration,
            creator.signer.address,
            marketSettings.curveType,
            marketSettings.taxationRate
        )).wait()
        
        const firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
        
        marketInstance = await etherlime.ContractAt(MarketAbi, firstMarketDataObj[0]);
        vaultInstance = await etherlime.ContractAt(VaultAbi, firstMarketDataObj[1]);
        
        // Setting up dai
        for(let i = 0; i < 5; i++){
            // Getting tokens
            await (await pseudoDaiInstance.from(accounts[i]).mint());
            // Setting approval
            await (await pseudoDaiInstance.from(accounts[i]).approve(
                marketInstance.contract.address,
                ethers.constants.MaxUint256
            ))
        }
    });

    describe("Market interactions", async () => {
        it("Validates funding on mint accurately", async () => {
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");
            
            //note: changed 101 to 100 to see if the scaling is fixed somehow?
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101);
            const estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            let balance = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            currentPhase = await vaultInstance.currentPhase();
            
            assert.equal(currentPhase.toString(), 1, "Phase invalid");

            const balanceShifted = BigNumber(balance.toString())
                .shiftedBy(-DECIMALS)
                .decimalPlaces(EXPECTED_PRECISION);
            const fundingGoalShifted = BigNumber(marketSettings.fundingGoals[0].toString())
                .shiftedBy(-DECIMALS);
            
            assert(balanceShifted.toString() >= fundingGoalShifted.toString(), "Vault balance invalid")
        });

        it("Increments the round if funding is reached", async () =>{
            let currentPhase = await vaultInstance.currentPhase();
            assert.equal(currentPhase, 0, "Phase invalid");

            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101);
            const estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            let balance = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            phaseData = await vaultInstance.fundingPhase(0);
            currentPhase = await vaultInstance.currentPhase();

            assert.ok(currentPhase.eq(1), "Phase invalid");
            assert.equal(phaseData[4], 2, "Phase state not set to ended");
            assert.ok(balance.gte(marketSettings.fundingGoals[0]), "Vault balance invalid")
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

        it("Validates funding ends last round correctly", async () => {
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");
            
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101);
            let estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)

            let vaultBalanceBeforeMint = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            let marketBalanceBeforeMint = await pseudoDaiInstance.balanceOf(marketInstance.contract.address);
            let molVaultBalanceBeforeMint = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);

            assert.equal(vaultBalanceBeforeMint.toString(), 0, "Had funding before tokens where bought");
            assert.equal(marketBalanceBeforeMint.toString(), 0, "Had funding before tokens where bought");
            assert.equal(molVaultBalanceBeforeMint.toString(), 0, "Had funding before tokens where bought");

            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            let vaultBalanceAfterMint = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            let marketBalanceAfterMint = await pseudoDaiInstance.balanceOf(marketInstance.contract.address);
            let molVaultBalanceAfterMint = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);

            assert.notEqual(vaultBalanceAfterMint.toString(), 0, "Minting did not fund vault");
            assert.notEqual(marketBalanceAfterMint.toString(), 0, "Minting did not collateralize market");
            assert.equal(molVaultBalanceAfterMint.toString(), 0, "Mol vault had funding before withdraw");
            
            phaseData = await vaultInstance.fundingPhase(0);
            let phaseTwo = await vaultInstance.fundingPhase(1);
            currentPhase = await vaultInstance.currentPhase();

            assert.ok(currentPhase.eq(1), "Phase not incremented");
            assert.equal(phaseData[4], 2, "Phase state not set to ended");

            await vaultInstance.from(creator).withdraw();
            phaseData = await vaultInstance.fundingPhase(0);

            let vaultBalance = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            let molVaultBalance = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);

            const molVaultBalanceShifted = BigNumber(molVaultBalance.toString())
                .shiftedBy(-DECIMALS)
                .decimalPlaces(EXPECTED_PRECISION);

            assert.equal(molVaultBalanceShifted.toString(), 750000, "Molecule vault did not receive correct tax");
            assert.equal(vaultBalance.toString(), phaseTwo[1].toString(), "Funding leftover not equal to next rounds funding");
            await assert.revert(marketInstance.from(user2).mint(user2.signer.address, estimateTokens), "Mint succeeded incorrectly");
        });
    });

    describe('End of phase withdraws', async () => {
        it('Withdraw at the end of phase 1', async () => {
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");
            
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(102);
            let estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)
            let balanceOfVaultBeforeMint = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            
            assert.equal(balanceOfVaultBeforeMint.toString(), 0, "Vault had funding before mint");
            
            phaseData = await vaultInstance.fundingPhase(0);
            currentPhase = await vaultInstance.currentPhase();
            
            assert.ok(currentPhase.eq(1), "Phase not incremented");
            assert.equal(phaseData[4], 2, "Phase state not set to ended");

            let balanceOfVaultBefore = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address)
            let balanceOfMolVaultBefore = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address)
            await vaultInstance.from(creator).withdraw();
            let balanceOfVaultAfter = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address)
            let balanceOfMolVaultAfter = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address)

            assert.notEqual(balanceOfMolVaultBefore.toString(), balanceOfMolVaultAfter.toString(), "Mol vault balance incorrect");
            assert.equal(balanceOfMolVaultBefore.toString(), 0, "Mol vault started with funding");
            assert(balanceOfVaultBefore.toString() >= balanceOfVaultAfter.toString(), "Vault balance larger after withdraw");
            assert(balanceOfVaultBefore.toString() >= phaseData[0].toString(), "Vault balance larger after withdraw");
            assert.notEqual(balanceOfVaultBefore.toString(), balanceOfVaultAfter.toString(), "Mol vault balance incorrect");
        });
    });

    describe('Admin functions', async () => {
        it('Terminate market', async () => {
            await assert.revert(vaultInstance.from(user1).terminateMarket(), "Unauthorised termination");
            await assert.notRevert(vaultInstance.from(creator).terminateMarket(), "Termination failed");
        });

        it("Withdraws after a fund is raised successfully", async () => {
            await assert.revert(vaultInstance.from(creator).withdraw(), "Withdraw succeeded incorrectly")
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101);
            let estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase.div(2))
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            
            await assert.revert(vaultInstance.from(creator).withdraw(), "Withdraw succeeded despite phase not completed incorrectly")
            
            estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase.div(2))
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            const balanceOfCreatorBefore = await pseudoDaiInstance.balanceOf(creator.signer.address)
            const balanceOfMoleVaultBefore = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address)
            const outstandingBefore = await vaultInstance.outstandingWithdraw();

            await assert.notRevert(vaultInstance.from(creator).withdraw(), "Withdraw failed")
            
            const outstandingAfter = await vaultInstance.outstandingWithdraw();
            const balanceOfCreatorAfter = await pseudoDaiInstance.balanceOf(creator.signer.address)
            const balanceOfMoleVaultAfter = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address)
            
            assert.ok(outstandingBefore.gt(outstandingAfter), "Amount not deducted");
            assert.ok(outstandingAfter.eq(0), "Not all funds deducted");
            assert.ok(balanceOfCreatorBefore.lt(balanceOfCreatorAfter), "Tokens not transfered to creator")
            assert.ok(balanceOfMoleVaultBefore.lt(balanceOfMoleVaultAfter), "Tokens not transfered to molecule vault")
        });
    });

    describe("Events", async () => {
        it("Emits FundingWithdrawn", async () => {
            await assert.revert(vaultInstance.from(creator).withdraw(), "Withdraw succeeded incorrectly")
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101);

            let estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase);
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            const txReceipt = await (await vaultInstance.from(creator).withdraw()).wait();

            const FundsWithdrawn = (await(txReceipt.events.filter(
                event => event.topics[0] == vaultInstance.interface.events.FundingWithdrawn.topic
            ))).map(FundsWithdrawnEvent => vaultInstance.interface.parseLog(FundsWithdrawnEvent))[0]

            assert.equal(FundsWithdrawn.values.phase.toString(), 0, "Event phase emitted incorrectly");
            assert(FundsWithdrawn.values.amount >= marketSettings.fundingGoals[0], "Event value emitted incorrectly");
        });

        it("Emits PhaseFinalised", async () => {
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");

            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101);
            const estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)
            const txReceipt = await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            const PhaseFinalised = (await(txReceipt.events.filter(
                event => event.topics[0] == vaultInstance.interface.events.PhaseFinalised.topic
            ))).map(PhaseFinalisedEvent => vaultInstance.interface.parseLog(PhaseFinalisedEvent))[0]

            assert.equal(PhaseFinalised.values.phase.toString(), 0, "Event phase emitted incorrectly")
            assert.equal(PhaseFinalised.values.amount.toString(), marketSettings.fundingGoalsWithTax[0].toString(), "Event value emitted incorrectly")
        });
    });

    describe('Meta data', async () => {
        it('Get funding phase data', async () => {
            const fundingData = await vaultInstance.fundingPhase(0);

            assert.notEqual(fundingData[0].toNumber, 0, "Funding threshold incorrect")
            assert.equal(fundingData[2].toString(), marketSettings.phaseDuration[0].toString(), "Phase incorrect")
            assert.equal(fundingData[4].toString(), 1, "State incorrect")
        });

        it('Get outstanding withdraw amount', async () =>{
            const outstandingWithdraw = await vaultInstance.outstandingWithdraw();
            assert.ok(outstandingWithdraw.eq(0), "Phase invalid");
        });

        it('Get total phases', async () => {
            const allPhases = await vaultInstance.getTotalRounds();
            assert.equal(allPhases.toString(), 3, "Phase invalid");
        });

        it('Get current phase', async () => {
            const currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");
        });

        it('Get market', async () => {
            const marketAddress = await vaultInstance.market();
            assert.equal(marketAddress, marketInstance.contract.address, "Market Contract address invaild")
        });
    });

    describe("Admin Managed Specific", async () => {
        it("Only admin can add an admin", async () => {
            await assert.notRevert(vaultInstance.from(creator).addWhitelistAdmin(user1.signer.address))
            await assert.revert(vaultInstance.from(user2).addWhitelistAdmin(user1.signer.address))
        });

        it("Only mol admin can remove an admin", async () =>{
            await assert.notRevert(vaultInstance.from(creator).addWhitelistAdmin(user1.signer.address))

            // Checks a normal admin cannot remove another admin
            await assert.revert(vaultInstance.from(user1).removeWhitelistAdmin(molAdmin.signer.address))
            // Checks the super admin can remove another admin
            await assert.notRevert(vaultInstance.from(creator).removeWhitelistAdmin(user1.signer.address))
        });

        it("Admin can remove themselves as an admin", async () =>{
            await assert.notRevert(vaultInstance.from(creator).addWhitelistAdmin(user1.signer.address))

            // Checks a non admin cannot remove themselves
            await assert.revert(vaultInstance.from(user2).renounceWhitelistAdmin())
            // Checks an admin can remove themselves as an admin
            await assert.notRevert(vaultInstance.from(user1).renounceWhitelistAdmin())
        });

        it("One admin must always be present in the contract", async () =>{
            await assert.notRevert(vaultInstance.from(creator).addWhitelistAdmin(user1.signer.address))
            
            // A non admin may not remove themselves
            await assert.revert(vaultInstance.from(user2).renounceWhitelistAdmin())
            // A admin may remove themselves
            await assert.notRevert(vaultInstance.from(user1).renounceWhitelistAdmin())
            // Ensuring there is only 1 admin left in the contract
            let adminCount = await vaultInstance.getAdminCount();
            assert.equal(
                adminCount.toString(),
                1,
                "Incorrect admin count"
            );
            // Mol admin should not be able to remove themselves as they are the last admin
            await assert.revert(vaultInstance.from(creator).renounceWhitelistAdmin());
            // Checking there is still the correct number of admins in the contract
            adminCount = await vaultInstance.getAdminCount();
            assert.equal(
                adminCount.toString(),
                1,
                "Incorrect admin count"
            );
        });

        it("Initial admin can replace themselves", async () =>{
            await assert.notRevert(vaultInstance.from(creator).addNewInitialAdmin(user1.signer.address))

            await assert.revert(vaultInstance.from(creator).removeWhitelistAdmin(user1.signer.address))
            await assert.notRevert(vaultInstance.from(user1).removeWhitelistAdmin(creator.signer.address))
        });

        describe("Meta Data", async () => {
            it("Checks if admin", async () =>{
                let adminStatus = await vaultInstance.from(creator).isWhitelistAdmin(user1.signer.address)
                assert.ok(!adminStatus, "Admin status incorrect")
                
                await assert.notRevert(vaultInstance.from(creator).addWhitelistAdmin(user1.signer.address), "Adding admin failed")
                
                adminStatus = await vaultInstance.from(creator).isWhitelistAdmin(user1.signer.address)
                assert.ok(adminStatus, "Admin status not updated")
            });
        });
    });

    describe("Admin functions", async () => {
        it('Deployer cannot access Market Factory admin functions', async () => {
            await assert.revert(
                marketFactoryInstance.from(insecureDeployer).deployMarket(
                    marketSettings.fundingGoals,
                    marketSettings.phaseDuration,
                    creator.signer.address,
                    marketSettings.curveType,
                    marketSettings.taxationRate
                )
            );
        });

        it('Deployer cannot access Market Registry admin functions', async () => {
            await assert.revert(
                marketRegistryInstance.from(insecureDeployer)
                    .addMarketDeployer(
                        marketFactoryInstance.contract.address,
                        "Initial factory"
                    )
            );
        });

        it('Deployer cannot access Curve Registry admin functions', async () => {
            await assert.revert(
                curveRegistryInstance.from(insecureDeployer).registerCurve(
                    curveIntegralInstance.contract.address,
                    "y-axis shift"
                )
            );
        });
    });
});
