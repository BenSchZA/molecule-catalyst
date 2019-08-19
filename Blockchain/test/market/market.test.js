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
            // Still need to test:
            // * collateralToTokenSelling()
            // * burn()

            const defaultDaiPurchase = ethers.utils.parseUnits("5000000", 18);
            
            const tokenResult = await marketInstance.collateralToTokenBuying(defaultDaiPurchase);
            console.log(`Token result = ${tokenResult.toString()}`);

            const priceToMint = await marketInstance.priceToMint(tokenResult);
            console.log(`Price to mint = ${priceToMint.toString()}`);

            const daiBalanceBefore = await pseudoDaiInstance.balanceOf(user1.signer.address);
            console.log(`Dai balance before = ${daiBalanceBefore.toString()}`);
            assert(daiBalanceBefore.gt(defaultDaiPurchase), "User doesn't have enough Dai");

            const mintTX = await marketInstance.from(user1).mint(
                user1.signer.address,
                tokenResult
            );
            const mintReceipt = await marketInstance.verboseWaitForTransaction(mintTX, "Mint tokens");

            const daiBalanceAfter = await pseudoDaiInstance.balanceOf(user1.signer.address);
            console.log(`Dai balance after = ${daiBalanceAfter.toString()}`);

            const tokenBalanceAfter = await marketInstance.balanceOf(user1.signer.address);
            const rewardForBurn = await marketInstance.rewardForBurn(tokenBalanceAfter);
            console.log(`Token balance after = ${tokenBalanceAfter.toString()}`);
            console.log(`Reward for burn = ${rewardForBurn.toString()}`);

            // Process for reasonable precision check
            BigNumber.config({ DECIMAL_PLACES: 18 - 3 });
            BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_UP });
            const rewardForBurnBN = BigNumber(rewardForBurn.toString()).div('1e18').decimalPlaces(18 - 6);
            const defaultDaiPurchaseBN = BigNumber(defaultDaiPurchase.toString()).div('1e18');
            console.log(`Default Dai purchase BN = ${defaultDaiPurchaseBN}`);
            console.log(`Reward for burn BN = ${rewardForBurnBN}`);

            assert(rewardForBurnBN.isEqualTo(defaultDaiPurchaseBN), "Reward doesn't equal purchased value");

            const transfers = (await mintReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.Transfer.topic
            )).map(transferEvent => marketInstance.interface.parseLog(transferEvent));
            
            const purposedBurnValue = transfers[0].values.value.sub(transfers[1].values.value);
            assert(purposedBurnValue.eq(rewardForBurn), "Reward for burn incorrect")
        });

        // it("Calculates Token to Dai accurately - Burn", async () =>{
        //     let daiBalance = await pseudoDaiInstance.balanceOf(user1.signer.address);
        //     const txReceipt = await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();

        //     const balance = await marketInstance.balanceOf(user1.signer.address);
        //     console.log("       xxx Market - Reward for burn function failing");
        //     const rewardForBurn = await marketInstance.rewardForBurn(balance);


        //     const transfers = (await(txReceipt.events.filter(
        //         event => event.topics[0] == marketInstance.interface.events.Transfer.topic
        //     ))).map(transferEvent => marketInstance.interface.parseLog(transferEvent))
            
        //     const purposedBurnValue = transfers[0].values.value.sub(transfers[1].values.value);
        //     assert.ok(purposedBurnValue.eq(rewardForBurn), "Reward for burn incorrect")

        //     // This will be the vault assert console.log(ethers.utils.formatUnits(transfers[1].values.value, 18))
        // });
    });

    // describe("Token exchange", async () => {
    //     it("Mints specified token amount", async () =>{
    //         await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
    //         const balance = await marketInstance.balanceOf(user1.signer.address);
    //         assert.ok(balance.eq(purchasingSequences.first.token.tokenResult))
    //     });

    //     it("Burns specified token amount", async () => {
    //         await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
    //         const balanceBefore = await marketInstance.balanceOf(user1.signer.address);

    //         const daiBalanceBefore = await pseudoDaiInstance.balanceOf(user1.signer.address);
    //         await assert.notRevert(marketInstance.from(user1).burn(balanceBefore));
            
    //         const balanceAfter = await marketInstance.balanceOf(user1.signer.address);
    //         const daiBalanceAfter = await pseudoDaiInstance.balanceOf(user1.signer.address);

    //         assert.ok(daiBalanceBefore.lt(daiBalanceAfter), "Dai Balance not increased");

    //         assert.ok(balanceAfter.lt(balanceBefore), "Token Balance not increased");
    //     });
    // });

    // describe("Vault interactions", async () => {
    //     it("Only Vault can finalise market", async () => {
    //         let activeState = await marketInstance.active();
    //         assert.ok(activeState, "Market incorrectly inactive");

    //         await assert.notRevert(vaultInstance.from(creator).terminateMarket());
    //         activeState = await marketInstance.active();
    //         assert.ok(!activeState, "Market incorrectly active");
    //     });

    //     it("When finalised, mint/burn unavailable", async () =>{
    //         await assert.notRevert(marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult))
    //         await assert.notRevert(vaultInstance.from(creator).terminateMarket());
    //         await assert.revert(marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult))
    //         await assert.revert(marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult))
    //     });

    //     it("When finalised, withdraw functions correctly", async () => {
    //         await assert.notRevert(marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult))
    //         await assert.revert(marketInstance.from(user1).withdraw(purchasingSequences.first.token.tokenResult))
    //         await assert.notRevert(vaultInstance.from(creator).terminateMarket());

    //         const daiBalanceBefore = await pseudoDaiInstance.balanceOf(user1.signer.address);
    //         await assert.notRevert(marketInstance.from(user1).withdraw(purchasingSequences.first.token.tokenResult))
    //         const daiBalanceAfter = await pseudoDaiInstance.balanceOf(user1.signer.address);
    //         const tokenBalanceAfter = await marketInstance.balanceOf(user1.signer.address);

    //         assert.ok(daiBalanceBefore.lt(daiBalanceAfter), "Dai balance not increased")
    //         assert.ok(tokenBalanceAfter.eq(0), "Token balance not decreased")
    //     });
    // });

    // describe("Events", async () => {
    //     it('Emits Transfer in mint', async () =>{
    //         const txReceipt = await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
            
    //         const transfers = (await(txReceipt.events.filter(
    //             event => event.topics[0] == marketInstance.interface.events.Transfer.topic
    //         ))).map(transferEvent => marketInstance.interface.parseLog(transferEvent))

    //         assert.ok(transfers[2].values.value.eq(purchasingSequences.first.token.tokenResult), "Event emitted incorrectly")
    //     });

    //     it('Emits Transfer in burn', async () => {
    //         await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
            
    //         const balance = await marketInstance.balanceOf(user1.signer.address);
            
    //         const txReceipt = await (await marketInstance.from(user1).burn(balance)).wait();
            
    //         const transfers = (await(txReceipt.events.filter(
    //             event => event.topics[0] == marketInstance.interface.events.Transfer.topic
    //         ))).map(transferEvent => marketInstance.interface.parseLog(transferEvent))

    //         assert.ok(transfers[1].values.value.eq(balance), "Event emitted incorrectly")
    //     });

    //     it('Emits Approve', async () => {
    //         const txReceipt = await (await marketInstance.from(user1).approve(user2.signer.address, ethers.constants.MaxUint256)).wait();
    //         const approvals = (await(txReceipt.events.filter(
    //             event => event.topics[0] == marketInstance.interface.events.Approval.topic
    //         ))).map(approveEvent => marketInstance.interface.parseLog(approveEvent))[0]

    //         assert.ok(approvals.values.value.eq(ethers.constants.MaxUint256), "Event emitted incorrectly")
    //     });

    //     it('Emits MarketTerminated', async () => {
    //         const txReceipt = await (await vaultInstance.from(creator).terminateMarket()).wait();
            
    //         const marketTerminated = (await(txReceipt.events.filter(
    //             event => event.topics[0] == marketInstance.interface.events.MarketTerminated.topic
    //         ))).map(termintatedEvent => marketInstance.interface.parseLog(termintatedEvent))

    //         assert.ok(marketTerminated != undefined, "Event emitted incorrectly")
    //     });
    // });

    // describe("Meta data", async () => {
    //     it('Get taxationRate', async () =>{
    //         const taxationRate = await marketInstance.taxationRate();
    //         assert.ok(taxationRate.eq(marketSettings.taxationRate), "Taxation rate not set");
    //     });

    //     it('Get active state', async () => {
    //         let activeState = await marketInstance.active();
    //         assert.ok(activeState, "Market incorrectly inactive");
    //         await assert.notRevert(vaultInstance.from(creator).terminateMarket());
            
    //         activeState = await marketInstance.active();
    //         assert.ok(!activeState, "Active state not updated");
    //     });
    // });

    // describe("ERC20 Functions", async () => {
    //     describe("Controls", async () => {
    //         it("Transfers", async ()=> {
    //             await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
    //             let balanceUser1 = await marketInstance.balanceOf(user1.signer.address);
    //             let balanceUser2 = await marketInstance.balanceOf(user2.signer.address);
    //             assert.ok(balanceUser2.eq(0), "Balance already has funds")

    //             await (await marketInstance.from(user1).transfer(user2.signer.address, balanceUser1.div(2)))
    //             balanceUser2 = await marketInstance.balanceOf(user2.signer.address);
    //             assert.ok(balanceUser2.eq(balanceUser1.div(2)), "Balance already has funds")
    //         });

    //         it("Sets allowance", async () => {
    //             await assert.notRevert(marketInstance.from(user1).approve(user2.signer.address, ethers.constants.MaxUint256));
    //             const allowance = await marketInstance.allowance(user1.signer.address, user2.signer.address);
    //             assert.ok(allowance.eq(ethers.constants.MaxUint256), "Allowance not set");
    //         });

    //         it("Transfers from account", async () => {
    //             await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();
    //             await assert.notRevert(marketInstance.from(user1).approve(user2.signer.address, ethers.constants.MaxUint256));
    //             const allowance = await marketInstance.allowance(user1.signer.address, user2.signer.address);
    //             assert.ok(allowance.eq(ethers.constants.MaxUint256), "Allowance not set");
    //             await assert.notRevert(marketInstance.from(user2).transferFrom(user1.signer.address, user2.signer.address, purchasingSequences.first.token.tokenResult.div(2)))
    //         });
    //     });

    //     describe("Meta data", async () => {
    //         it('Get allowance', async () => {
    //             let allowance = await marketInstance.allowance(user1.signer.address, user2.signer.address);
    //             assert.ok(allowance.eq(0), "Allowance already set");
    
    //             await (await marketInstance.from(user1).approve(user2.signer.address, ethers.constants.MaxUint256)).wait();
    //             allowance = await marketInstance.allowance(user1.signer.address, user2.signer.address);
    //             assert.ok(allowance.eq(ethers.constants.MaxUint256), "Allowance not set");
    //         });
    
    //         it('Get totalSupply', async () =>{
    //             let totalSupply = await marketInstance.totalSupply();
    //             assert.ok(totalSupply.eq(0), "Total supply invalid")
    //             await assert.notRevert(await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult));
                
    //             totalSupply = await marketInstance.totalSupply();
    //             assert.ok(totalSupply.eq(purchasingSequences.first.token.tokenResult), "Total supply not increased")
    //         });
    
    //         it('Get balanceOf', async () =>{
    //             let balance = await marketInstance.balanceOf(user1.signer.address);
    //             assert.ok(balance.eq(0), "Balance invalid")
    //             await assert.notRevert(await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult));
                
    //             balance = await marketInstance.balanceOf(user1.signer.address);
    //             assert.ok(balance.eq(purchasingSequences.first.token.tokenResult), "Balance not increased")
    //         });
    
    //         it('Get poolBalance', async () =>{
    //             let poolBalance = await marketInstance.poolBalance();
    //             assert.ok(poolBalance.eq(0), "Pool balance invalid")
    //             await assert.notRevert(await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult));
    //             poolBalance = await marketInstance.poolBalance();
    //             assert.ok(poolBalance.gt(0), "Pool balance not increased")
    //         });
    
    //         it('Get decimals', async () => {
    //             const decimals = await marketInstance.decimals();
    //             assert.ok(decimals.eq(18), "Decimals not set")
    //         });
    //     });
    // });
});
