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

const BigNumber = require('bignumber.js');

describe('Market test', async () => {
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

    describe("Pricing functions", async () => {
        it("Token <-> collateral conversions accurate", async() => {
            // This tests:
            // * collateralToTokenBuying()
            // * priceToMint()
            // * mint()
            // * rewardForBurn()
            // * Transfer() event
            // * collateralToTokenSelling()
            // * burn()

            const DECIMALS = 18;
            const EXPECTED_PRECISION = DECIMALS - 6;
            BigNumber.config({ DECIMAL_PLACES: EXPECTED_PRECISION });
            BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_UP });
            
            /* ############################################################################################ */
            // Get token value of requested Dai value purchase (not including tax)

            const defaultDaiPurchase = ethers.utils.parseUnits("5000000", 18);
            
            const tokenResult = await marketInstance.collateralToTokenBuying(defaultDaiPurchase);
            const priceToMint = await marketInstance.priceToMint(tokenResult);
            const daiBalanceBefore = await pseudoDaiInstance.balanceOf(user1.signer.address);

            assert(daiBalanceBefore.gt(defaultDaiPurchase), "User doesn't have enough Dai");
            /* ############################################################################################ */
            // Mint previous token value (tax now added)
            // Ensure rewardForBurn() == Dai purchase value

            const mintTX = await marketInstance.from(user1).mint(
                user1.signer.address,
                tokenResult
            );
            const mintReceipt = await marketInstance.verboseWaitForTransaction(mintTX, "Mint tokens");

            const daiBalanceAfter = await pseudoDaiInstance.balanceOf(user1.signer.address);
            const tokenBalanceAfter = await marketInstance.balanceOf(user1.signer.address);
            const rewardForBurn = await marketInstance.rewardForBurn(tokenBalanceAfter);
            
            // Check taxation
            assert.equal(
                BigNumber(defaultDaiPurchase.toString())
                    .shiftedBy(-DECIMALS).toString(),
                BigNumber(priceToMint.toString())
                    .shiftedBy(-DECIMALS)
                    .decimalPlaces(EXPECTED_PRECISION).toString(), 
                "Tax incorrect");
            assert.equal(
                (daiBalanceBefore.sub(daiBalanceAfter)).toString(), 
                priceToMint.toString(), 
                "Dai balance not accurate");

            // Process for reasonable precision check
            const rewardForBurnBN = BigNumber(rewardForBurn.toString())
                .shiftedBy(-DECIMALS)
                .decimalPlaces(EXPECTED_PRECISION);
            const defaultDaiPurchaseBN = BigNumber(
                    defaultDaiPurchase.sub(defaultDaiPurchase.mul(moleculeVaultSettings.taxationRate).div(100))
                .toString())
                .shiftedBy(-DECIMALS);
            // console.log(`Default Dai purchase BN = ${defaultDaiPurchaseBN}`);
            // console.log(`Reward for burn BN = ${rewardForBurnBN}`);

            assert.equal(rewardForBurnBN.toString(), defaultDaiPurchaseBN.toString(), "Reward doesn't equal purchased value");
            /* ############################################################################################ */
            // Check Transfer() event accurate

            const transfers = (await mintReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.Transfer.topic
            )).map(transferEvent => marketInstance.interface.parseLog(transferEvent));
            
            const mintEventValue = transfers[0].values.value.sub(transfers[1].values.value);
            assert(mintEventValue.eq(rewardForBurn), "Mint Transfer event incorrect");

            /* ############################################################################################ */
            // Check burn() and collateralToTokenSelling()

            const tokenSellingResult = await marketInstance.collateralToTokenSelling(rewardForBurn);
            
            const burnTX = await marketInstance.from(user1).burn(
                tokenSellingResult
            );
            const burnReceipt = await marketInstance.verboseWaitForTransaction(burnTX, "Burn tokens");

            const tokenBalanceAfterBurn = await marketInstance.balanceOf(user1.signer.address);

            assert.equal(tokenBalanceAfterBurn.toString(), 0, "Tokens not burned accurately");
            assert.equal(tokenResult.toString(), tokenSellingResult.toString(), "Value of purchase not equal to value of sale");

            /* ############################################################################################ */
            // Check Transfer() event accurate

            const burnTransferEvents = (await burnReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.Transfer.topic
            )).map(transferEvent => marketInstance.interface.parseLog(transferEvent));
            
            const burnEventValue = burnTransferEvents[1].values.value;//.sub(burnTransferEvents[1].values.value);
            assert.equal(burnEventValue.toString(), tokenSellingResult.toString(), "Burn Transfer event incorrect");
        });
    });

    describe("Token exchange", async () => {
        it("Mints specified token amount", async () =>{
            await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
            const balance = await marketInstance.balanceOf(user1.signer.address);
            assert.ok(balance.eq(purchasingSequences.first.token.tokenResult))
        });

        it("Burns specified token amount", async () => {
            await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
            const balanceBefore = await marketInstance.balanceOf(user1.signer.address);

            const daiBalanceBefore = await pseudoDaiInstance.balanceOf(user1.signer.address);
            await assert.notRevert(marketInstance.from(user1).burn(balanceBefore));
            
            const balanceAfter = await marketInstance.balanceOf(user1.signer.address);
            const daiBalanceAfter = await pseudoDaiInstance.balanceOf(user1.signer.address);

            assert.ok(daiBalanceBefore.lt(daiBalanceAfter), "Dai Balance not increased");

            assert.ok(balanceAfter.lt(balanceBefore), "Token Balance not increased");
        });
    });

    describe("Vault interactions", async () => {
        it("Only Vault can finalise market", async () => {
            let activeState = await marketInstance.active();
            assert.ok(activeState, "Market incorrectly inactive");

            await assert.notRevert(vaultInstance.from(creator).terminateMarket());
            activeState = await marketInstance.active();
            assert.ok(!activeState, "Market incorrectly active");
        });

        it("When finalised, mint/burn unavailable", async () =>{
            await assert.notRevert(marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult))
            await assert.notRevert(vaultInstance.from(creator).terminateMarket());
            await assert.revert(marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult))
            await assert.revert(marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult))
        });

        it("When finalised, withdraw functions correctly", async () => {
            await assert.notRevert(marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult))
            await assert.revert(marketInstance.from(user1).withdraw(purchasingSequences.first.token.tokenResult))
            await assert.notRevert(vaultInstance.from(creator).terminateMarket());

            const daiBalanceBefore = await pseudoDaiInstance.balanceOf(user1.signer.address);
            await assert.notRevert(marketInstance.from(user1).withdraw(purchasingSequences.first.token.tokenResult))
            const daiBalanceAfter = await pseudoDaiInstance.balanceOf(user1.signer.address);
            const tokenBalanceAfter = await marketInstance.balanceOf(user1.signer.address);

            assert.ok(daiBalanceBefore.lt(daiBalanceAfter), "Dai balance not increased")
            assert.ok(tokenBalanceAfter.eq(0), "Token balance not decreased")
        });


        it("Sets the new end date of the second phase correctly", async () =>{
            let currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(0), "Phase invalid");
            
            let phaseData = await vaultInstance.fundingPhase(0);

            assert.equal(phaseData[4], 1, "Phase state not set to started");
            
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101);
            const estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            phaseData = await vaultInstance.fundingPhase(0);
            currentPhase = await vaultInstance.currentPhase();

            assert.ok(currentPhase.eq(1), "Phase invalid");
            assert.equal(phaseData[4], 2, "Phase state not set to ended");

            phaseData = await vaultInstance.fundingPhase(1);

            assert.equal(phaseData[4], 1, "Next phase state not set to started");
            assert.notEqual(phaseData[4].toString(), 0, "Phase invalid");
        });

        it("Withdraws multiple rounds if theres outstanding withdraws", async () => {
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101);

            let estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            phaseData = await vaultInstance.fundingPhase(0);
            currentPhase = await vaultInstance.currentPhase();
            assert.ok(currentPhase.eq(1), "Phase not incremented");
            assert.equal(phaseData[4], 2, "Phase state not set to ended");

            // Ending round 2
            phaseData = await vaultInstance.fundingPhase(1);
            daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101);
            estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user2).mint(user2.signer.address, estimateTokens)).wait();

            currentPhase = await vaultInstance.currentPhase();
            phaseData = await vaultInstance.fundingPhase(1);
            assert.ok(currentPhase.eq(2), "Phase not incremented to 2");
            assert.equal(phaseData[4], 2, "2nd phase state not set to ended");

            await assert.notRevert(vaultInstance.from(creator).withdraw(0), "Withdraw 0 failed")
            const outstandingAfter = await vaultInstance.outstandingWithdraw();

            phaseData = await vaultInstance.fundingPhase(1);
            assert.ok(outstandingAfter.gt(0), "Outstanding is 0")
            assert.ok(phaseData[0].eq(outstandingAfter.div(100).mul(moleculeVaultSettings.taxationRate.add(100))), "Outstanding withdraw incorrect")

            await assert.notRevert(vaultInstance.from(creator).withdraw(1), "Withdraw 1 failed")
            const outstandingEnd = await vaultInstance.outstandingWithdraw();
            assert.ok(outstandingEnd.eq(0), "All funds not sent");

            await assert.revert(vaultInstance.from(creator).withdraw(1), "Withdraw 1 replayed incorrectly")
        });
    });

    describe("Events", async () => {
        it('Emits Transfer in mint', async () =>{
            const txReceipt = await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
            
            const transfers = (await(txReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.Transfer.topic
            ))).map(transferEvent => marketInstance.interface.parseLog(transferEvent))

            assert.ok(transfers[2].values.value.eq(purchasingSequences.first.token.tokenResult), "Event emitted incorrectly")
        });

        it('Emits Mint in mint', async () =>{
            const txReceipt = await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
            
            const transfers = (await(txReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.Mint.topic
            ))).map(mintEvent => marketInstance.interface.parseLog(mintEvent));

            const balance = await marketInstance.balanceOf(user1.signer.address);

            assert.equal(transfers[0].values.to, user1.signer.address, "User address not in event");
            assert.equal(balance.toString(), transfers[0].values.amountMinted.toString(), "User balance does not match event");
            assert.notEqual(transfers[0].values.collateralAmount.toString(), 0, "Amount spent is 0");
            assert.notEqual(transfers[0].values.researchContribution.toString(), 0, "Tax is 0");
        });

        it('Emits Transfer in burn', async () => {
            await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
            
            const balance = await marketInstance.balanceOf(user1.signer.address);
            
            const txReceipt = await (await marketInstance.from(user1).burn(balance)).wait();
            
            const transfers = (await(txReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.Transfer.topic
            ))).map(transferEvent => marketInstance.interface.parseLog(transferEvent))

            assert.ok(transfers[1].values.value.eq(balance), "Event emitted incorrectly")
        });

        it('Emits Burn in burn', async () => {
            await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
            
            const balance = await marketInstance.balanceOf(user1.signer.address);
            
            const txReceipt = await (await marketInstance.from(user1).burn(balance)).wait();
            
            const transfers = (await(txReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.Burn.topic
            ))).map(burnEvent => marketInstance.interface.parseLog(burnEvent))

            assert.equal(transfers[0].values.from, user1.signer.address, "User address not in event");
            assert.equal(purchasingSequences.first.token.tokenResult.toString(), transfers[0].values.amountBurnt.toString(), "Mismatch burning to event");
        });

        it('Emits Approve', async () => {
            const txReceipt = await (await marketInstance.from(user1).approve(user2.signer.address, ethers.constants.MaxUint256)).wait();
            const approvals = (await(txReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.Approval.topic
            ))).map(approveEvent => marketInstance.interface.parseLog(approveEvent))[0]

            assert.ok(approvals.values.value.eq(ethers.constants.MaxUint256), "Event emitted incorrectly")
        });

        it('Emits MarketTerminated', async () => {
            const txReceipt = await (await vaultInstance.from(creator).terminateMarket()).wait();
            
            const marketTerminated = (await(txReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.MarketTerminated.topic
            ))).map(termintatedEvent => marketInstance.interface.parseLog(termintatedEvent))

            assert.ok(marketTerminated != undefined, "Event emitted incorrectly")
        });
    });

    describe("Meta data", async () => {
        it('Get taxationRate', async () =>{
            const taxationRate = await marketInstance.taxationRate();
            assert.ok(taxationRate.eq(marketSettings.taxationRate), "Taxation rate not set");
        });

        it('Get active state', async () => {
            let activeState = await marketInstance.active();
            assert.ok(activeState, "Market incorrectly inactive");
            await assert.notRevert(vaultInstance.from(creator).terminateMarket());
            
            activeState = await marketInstance.active();
            assert.ok(!activeState, "Active state not updated");
        });
    });

    describe("ERC20 Functions", async () => {
        describe("Controls", async () => {
            it("Transfers", async ()=> {
                await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
                let balanceUser1 = await marketInstance.balanceOf(user1.signer.address);
                let balanceUser2 = await marketInstance.balanceOf(user2.signer.address);
                assert.ok(balanceUser2.eq(0), "Balance already has funds")

                await (await marketInstance.from(user1).transfer(user2.signer.address, balanceUser1.div(2)))
                balanceUser2 = await marketInstance.balanceOf(user2.signer.address);
                assert.ok(balanceUser2.eq(balanceUser1.div(2)), "Balance already has funds")
            });

            it("Sets allowance", async () => {
                await assert.notRevert(marketInstance.from(user1).approve(user2.signer.address, ethers.constants.MaxUint256));
                const allowance = await marketInstance.allowance(user1.signer.address, user2.signer.address);
                assert.ok(allowance.eq(ethers.constants.MaxUint256), "Allowance not set");
            });

            it("Transfers from account", async () => {
                await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
                await assert.notRevert(marketInstance.from(user1).approve(user2.signer.address, ethers.constants.MaxUint256));
                const allowance = await marketInstance.allowance(user1.signer.address, user2.signer.address);
                assert.ok(allowance.eq(ethers.constants.MaxUint256), "Allowance not set");
                await assert.notRevert(marketInstance.from(user2).transferFrom(user1.signer.address, user2.signer.address, purchasingSequences.first.token.tokenResult.div(2)))
            });
        });

        describe("Meta data", async () => {
            it('Get allowance', async () => {
                let allowance = await marketInstance.allowance(user1.signer.address, user2.signer.address);
                assert.ok(allowance.eq(0), "Allowance already set");
    
                await (await marketInstance.from(user1).approve(user2.signer.address, ethers.constants.MaxUint256)).wait();
                allowance = await marketInstance.allowance(user1.signer.address, user2.signer.address);
                assert.ok(allowance.eq(ethers.constants.MaxUint256), "Allowance not set");
            });
    
            it('Get totalSupply', async () =>{
                let totalSupply = await marketInstance.totalSupply();
                assert.ok(totalSupply.eq(0), "Total supply invalid")
                await assert.notRevert(await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult));
                
                totalSupply = await marketInstance.totalSupply();
                assert.ok(totalSupply.eq(purchasingSequences.first.token.tokenResult), "Total supply not increased")
            });
    
            it('Get balanceOf', async () =>{
                let balance = await marketInstance.balanceOf(user1.signer.address);
                assert.ok(balance.eq(0), "Balance invalid")
                await assert.notRevert(await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult));
                
                balance = await marketInstance.balanceOf(user1.signer.address);
                assert.ok(balance.eq(purchasingSequences.first.token.tokenResult), "Balance not increased")
            });

            it('Get total phases', async () => {
                const allPhases = await vaultInstance.getTotalRounds();
                assert.equal(allPhases.toString(), 3, "Phase invalid");
            });
    
            it('Get poolBalance', async () =>{
                let poolBalance = await marketInstance.poolBalance();
                assert.ok(poolBalance.eq(0), "Pool balance invalid")
                await assert.notRevert(await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult));
                poolBalance = await marketInstance.poolBalance();
                assert.ok(poolBalance.gt(0), "Pool balance not increased")
            });
    
            it('Get decimals', async () => {
                const decimals = await marketInstance.decimals();
                assert.ok(decimals.eq(18), "Decimals not set")
            });
        });
    });
});
