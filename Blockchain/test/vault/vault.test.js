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
    constants,
    defaultDaiPurchase,
    defaultTokenVolume,
    purchasingSequences
 } = require("../testing.settings.js");

describe('Vault test', () => {
    let molAdmin = accounts[1];
    let creator = accounts[2];
    let user1 = accounts[3];
    let user2 = accounts[4];
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

        // Creating a market
        await (await marketFactoryInstance.from(molAdmin).deployMarket(
            marketSettings.fundingGoals,
            marketSettings.phaseDuration,
            creator.signer.address,
            marketSettings.curveType,
            marketSettings.taxationRate,
            marketSettings.gradientDenominator,
            marketSettings.scaledShift
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

    describe("Market interactions", () => {
        it("Validates funding on mint accurately", async () => {
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");

            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);
            const estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();


            let balance = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);

            currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(1), "Phase invalid");

            assert.ok(balance.gte(marketSettings.fundingGoals[0]), "Vault balance invalid")
        })
        it("Increments the round if funding is reached", async () =>{
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");

            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);
            const estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();


            let balance = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);

            phaseData = await vaultInstance.fundingPhase(0);
            currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(1), "Phase invalid");
            assert.equal(phaseData[3], 2, "Phase state not set to ended");

            assert.ok(balance.gte(marketSettings.fundingGoals[0]), "Vault balance invalid")
        })

        it("Sets the new end date of the second phase correctly", async () =>{
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");

            let phaseData = await vaultInstance.fundingPhase(0);

            assert.equal(phaseData[3], 1, "Phase state not set to started");
            
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);
            const estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            phaseData = await vaultInstance.fundingPhase(0);
            currentPhase = await vaultInstance.currentPhase();

            assert.ok(currentPhase.eq(1), "Phase invalid");
            assert.equal(phaseData[3], 2, "Phase state not set to ended");

            phaseData = await vaultInstance.fundingPhase(1);
            assert.equal(phaseData[3], 1, "Next phase state not set to started");
            assert.ok(phaseData[2].gt(0), "Phase invalid");
        })
        it("Blocks minting if too much time has passed", async () =>{
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");

            // Making a purchase that doesn't end the round
            let phaseData = await vaultInstance.fundingPhase(0);
            let estimateTokens = await marketInstance.colateralToTokenBuying(ethers.utils.parseUnits("50000", 18))
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");

            // Progressing time past the targeted date
            const exceedtime = constants.monthInSeconds*(marketSettings.phaseDuration[0] + 1);
            await utils.timeTravel(deployer.provider, exceedtime);
            
            estimateTokens = await marketInstance.colateralToTokenBuying(ethers.utils.parseUnits("50000", 18))
            await assert.revert(marketInstance.from(user1).mint(user1.signer.address, estimateTokens), "Mint was allowed incorrectly")
        })
        it("Validates funding ends last round correctly", async () =>{
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");

            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);

            let estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            phaseData = await vaultInstance.fundingPhase(0);
            currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(1), "Phase not incremented");
            assert.equal(phaseData[3], 2, "Phase state not set to ended");

            // Ending round 2
            phaseData = await vaultInstance.fundingPhase(1);
            daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);
            estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user2).mint(user2.signer.address, estimateTokens)).wait();

            currentPhase = await vaultInstance.currentPhase();
            phaseData = await vaultInstance.fundingPhase(1);
            assert.ok(currentPhase.eq(2), "Phase not incremented to 2");
            assert.equal(phaseData[3], 2, "2nd phase state not set to ended");

            // Ending round 3
            phaseData = await vaultInstance.fundingPhase(2);
            daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);
            estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user2).mint(user2.signer.address, estimateTokens)).wait();

            currentPhase = await vaultInstance.currentPhase();
            phaseData = await vaultInstance.fundingPhase(2);
            assert.ok(currentPhase.eq(3), "Phase not incremented to 2");
            assert.equal(phaseData[3], 2, "3nd phase state not set to ended");

            // Checking that last 
            phaseData = await vaultInstance.fundingPhase(currentPhase);
            assert.equal(phaseData[3], 0, "Inactive phase state incorrect");

            // Checking that mints after are reverted
            estimateTokens = await marketInstance.colateralToTokenBuying(ethers.utils.parseUnits("50000", 18))
            await assert.revert(marketInstance.from(user2).mint(user2.signer.address, estimateTokens), "Mint succeeded incorrectly");

        })
    })

    describe('Admin functions', async () => {
        it('Terminate market', async () => {
            await assert.revert(vaultInstance.from(user1).terminateMarket(), "Unauthorised termination");
            await assert.notRevert(vaultInstance.from(creator).terminateMarket(), "Termination failed");
        });
        it("Withdraws after a fund is raised successfully", async () =>{

            await assert.revert(vaultInstance.from(creator).withdraw(0), "Withdraw succeeded incorrectly")
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);

            let estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase.div(2))
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            await assert.revert(vaultInstance.from(creator).withdraw(0), "Withdraw succeeded despite phase not completed incorrectly")

            estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase.div(2))
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            const balanceOfCreatorBefore = await pseudoDaiInstance.balanceOf(creator.signer.address)
            const balanceOfMoleVaultBefore = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address)

            const outstandingBefore = await vaultInstance.outstandingWithdraw();
            await assert.notRevert(vaultInstance.from(creator).withdraw(0), "Withdraw failed")
            const outstandingAfter = await vaultInstance.outstandingWithdraw();

            const balanceOfCreatorAfter = await pseudoDaiInstance.balanceOf(creator.signer.address)
            const balanceOfMoleVaultAfter = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address)

            assert.ok(outstandingBefore.gt(outstandingAfter), "Amount not deducted");
            assert.ok(outstandingAfter.eq(0), "Not all funds deducted");

            assert.ok(balanceOfCreatorBefore.lt(balanceOfCreatorAfter), "Tokens not transfered to creator")
            assert.ok(balanceOfMoleVaultBefore.lt(balanceOfMoleVaultAfter), "Tokens not transfered to molecule vault")
        })
        it("Withdraws all funds if all rounds are finished", async () =>{
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);

            let estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            phaseData = await vaultInstance.fundingPhase(0);
            currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(1), "Phase not incremented");
            assert.equal(phaseData[3], 2, "Phase state not set to ended");

            // Ending round 2
            phaseData = await vaultInstance.fundingPhase(1);
            daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);
            estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user2).mint(user2.signer.address, estimateTokens)).wait();

            currentPhase = await vaultInstance.currentPhase();
            phaseData = await vaultInstance.fundingPhase(1);
            assert.ok(currentPhase.eq(2), "Phase not incremented to 2");
            assert.equal(phaseData[3], 2, "2nd phase state not set to ended");

            // Ending round 3
            phaseData = await vaultInstance.fundingPhase(2);
            daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);
            estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user2).mint(user2.signer.address, estimateTokens)).wait();


            const balanceOfCreatorBefore = await pseudoDaiInstance.balanceOf(creator.signer.address)
            const balanceOfMoleVaultBefore = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address)

            const outstandingBefore = await vaultInstance.outstandingWithdraw();
            await assert.notRevert(vaultInstance.from(creator).withdraw(0), "Withdraw failed")
            const outstandingAfter = await vaultInstance.outstandingWithdraw();

            const balanceOfCreatorAfter = await pseudoDaiInstance.balanceOf(creator.signer.address)
            const balanceOfMoleVaultAfter = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address)

            assert.ok(outstandingBefore.gt(outstandingAfter), "Amount not deducted");
            assert.ok(outstandingAfter.eq(0), "Not all funds deducted");

            assert.ok(balanceOfCreatorBefore.lt(balanceOfCreatorAfter), "Tokens not transfered to creator")
            assert.ok(balanceOfMoleVaultBefore.lt(balanceOfMoleVaultAfter), "Tokens not transfered to molecule vault")

            const vaultDaiBalance = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
            assert.ok(vaultDaiBalance.eq(0), "Tokens remaining incorrectly")

            const marketActiveState = await marketInstance.active();
            assert.ok(!marketActiveState, "Market not terminated")
        })
        it("Withdraws multiple rounds if theres outstanding withdraws", async () => {
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);

            let estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            phaseData = await vaultInstance.fundingPhase(0);
            currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(1), "Phase not incremented");
            assert.equal(phaseData[3], 2, "Phase state not set to ended");

            // Ending round 2
            phaseData = await vaultInstance.fundingPhase(1);
            daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);
            estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user2).mint(user2.signer.address, estimateTokens)).wait();

            currentPhase = await vaultInstance.currentPhase();
            phaseData = await vaultInstance.fundingPhase(1);
            assert.ok(currentPhase.eq(2), "Phase not incremented to 2");
            assert.equal(phaseData[3], 2, "2nd phase state not set to ended");

            await assert.notRevert(vaultInstance.from(creator).withdraw(0), "Withdraw 0 failed")
            const outstandingAfter = await vaultInstance.outstandingWithdraw();

            phaseData = await vaultInstance.fundingPhase(1);
            assert.ok(outstandingAfter.gt(0), "Outstanding is 0")
            assert.ok(phaseData[0].eq(outstandingAfter.div(100).mul(moleculeVaultSettings.taxationRate.add(100))), "Outstanding withdraw incorrect")

            await assert.notRevert(vaultInstance.from(creator).withdraw(1), "Withdraw 1 failed")
            const outstandingEnd = await vaultInstance.outstandingWithdraw();
            assert.ok(outstandingEnd.eq(0), "All funds not sent");

            await assert.revert(vaultInstance.from(creator).withdraw(1), "Withdraw 1 replayed incorrectly")
        })
    });

    describe("Events", () => {
        it("Emits FundingWithdrawn", async () => {
            await assert.revert(vaultInstance.from(creator).withdraw(0), "Withdraw succeeded incorrectly")
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);

            let estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            const txReceipt = await (await vaultInstance.from(creator).withdraw(0)).wait();

            const FundsWithdrawn = (await(txReceipt.events.filter(
                event => event.topics[0] == vaultInstance.interface.events.FundingWithdrawn.topic
            ))).map(FundsWithdrawnEvent => vaultInstance.interface.parseLog(FundsWithdrawnEvent))[0]

            assert.ok(FundsWithdrawn.values.phase.eq(0), "Event phase emitted incorrectly")
            assert.ok(FundsWithdrawn.values.amount.eq(marketSettings.fundingGoals[0]), "Event value emitted incorrectly")
        })
        it("Emits PhaseFinalised", async () => {
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");

            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);
            const estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            const txReceipt = await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            const PhaseFinalised = (await(txReceipt.events.filter(
                event => event.topics[0] == vaultInstance.interface.events.PhaseFinalised.topic
            ))).map(PhaseFinalisedEvent => vaultInstance.interface.parseLog(PhaseFinalisedEvent))[0]

            assert.ok(PhaseFinalised.values.phase.eq(0), "Event phase emitted incorrectly")
            assert.ok(PhaseFinalised.values.amount.gt(marketSettings.fundingGoals[0]), "Event value emitted incorrectly")
        })
    })

    describe('Meta data', async () =>{
        it('Get Funding phase data', async () => {
            const fundingData = await vaultInstance.fundingPhase(0);
            assert.ok(fundingData[0].gt(0), "Funding threshold incorrect")
            assert.ok(fundingData[1].eq(marketSettings.phaseDuration[0]), "Phase incorrect")
            assert.ok(fundingData[2].gt(0), "Date not set")
            assert.equal(fundingData[3], 1, "State incorrect")
        });
        it('Get outstanding withdraw amount', async () =>{
            const outstandingWithdraw = await vaultInstance.outstandingWithdraw();
            assert.ok(outstandingWithdraw.eq(0), "Phase invalid")

            // TODO: Check after a fund phase succeeds
        });
        it('Get current phase', async () => {
            const currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid")


            // TODO: check once funding has increase to next phase
        });
        it('Get market', async () =>{
            const marketAddress = await vaultInstance.market();
            assert.equal(marketAddress, marketInstance.contract.address, "Market Contract address invaild")
        });
    })

    describe("Admin Managed Specific", () => {
        it("Only admin can add an admin", async () => {
            await assert.notRevert(vaultInstance.from(creator).addAdmin(user1.signer.address), "Adding admin failed")
            await assert.revert(vaultInstance.from(user2).addAdmin(user1.signer.address), "Unauthorised adding of admin")
        }),
        it("Only admin can remove an admin", async () =>{
            await assert.notRevert(vaultInstance.from(creator).addAdmin(user1.signer.address), "Adding admin failed")
            await assert.revert(vaultInstance.from(user2).removeAdmin(user1.signer.address), "Unauthorised removal of admin")

            await assert.notRevert(vaultInstance.from(creator).removeAdmin(user1.signer.address), "Removal of admin failed")
            
        }),
        describe("Meta Data", () => {
            it("Checks if admin", async () =>{
                let adminStatus = await vaultInstance.from(creator).isAdmin(user1.signer.address)
                assert.ok(!adminStatus, "Admin status incorrect")
                
                await assert.notRevert(vaultInstance.from(creator).addAdmin(user1.signer.address), "Adding admin failed")
                
                adminStatus = await vaultInstance.from(creator).isAdmin(user1.signer.address)
                assert.ok(adminStatus, "Admin status not updated")
            })
        })
    })
})
