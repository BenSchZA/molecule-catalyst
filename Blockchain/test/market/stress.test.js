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

let marketSettingsStress = {
    fundingGoals: [
        ethers.utils.parseUnits("5000000", 18),
    ],
    phaseDuration: [
        ethers.utils.parseUnits("12", 0),
    ],
    curveType: ethers.utils.parseUnits("0", 0),
    taxationRate: ethers.utils.parseUnits("15", 0)
}

describe('Market stress test', async () => {
    let insecureDeployer = accounts[0];
    let molAdmin = accounts[1];
    let creator = accounts[2];
    let user1 = accounts[3];
    let user2 = accounts[4];
    let admin2 = accounts[5];
    let backendMarketDeployer = accounts[6];
    let pseudoDaiInstance, moleculeVaultInstance, curveRegistryInstance, marketRegistryInstance, marketFactoryInstance, curveIntegralInstance;

    let marketInstance, vaultInstance;

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
        // Adding the admins (in deployment this would be the multsig)
        await marketFactoryInstance.from(insecureDeployer).init(
            molAdmin.signer.address,
            backendMarketDeployer.signer.address
        );
        // Adding the market deployer
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

        it("Handles a stress testing scenario", async () => {
            const sequences = 20;
            const mintVolumePerAction = (await vaultInstance.fundingPhase(0))[0].div(sequences);

            let pastBalance = []
            //
            for(let i = 0; i < sequences; i++){
                try{
                    let state = (await vaultInstance.fundingPhase(0))[4]
                    if(state == 2){ // Ended
                        break;
                    }
                    pastBalance[0] = await marketInstance.balanceOf(accounts[0].signer.address);
                    pastBalance[1] = await marketInstance.balanceOf(accounts[1].signer.address);
                    pastBalance[2] = await marketInstance.balanceOf(accounts[2].signer.address);
                    pastBalance[3] = await marketInstance.balanceOf(accounts[3].signer.address);
                    pastBalance[4] = await marketInstance.balanceOf(accounts[4].signer.address);
                    pastBalance[5] = await marketInstance.balanceOf(accounts[5].signer.address);
                    pastBalance[6] = await marketInstance.balanceOf(accounts[6].signer.address);
                    pastBalance[7] = await marketInstance.balanceOf(accounts[7].signer.address);
                    pastBalance[8] = await marketInstance.balanceOf(accounts[8].signer.address);
                    pastBalance[9] = await marketInstance.balanceOf(accounts[9].signer.address);

                    // Account 1 Mint
                    await (await marketInstance.from(accounts[0]).mint(accounts[0].signer.address, mintVolumePerAction)).wait();
                    const postMintBalance = await marketInstance.balanceOf(accounts[0].signer.address);
                    assert.ok(pastBalance[0].lt(postMintBalance));

                    // Other accounts mint
                    const transferValue = postMintBalance.sub(pastBalance[0]).div(4)

                    // Transfer 1/4 of mint to account 2
                    await (await marketInstance.from(accounts[0]).transfer(accounts[1].signer.address, transferValue))

                    // Receiver burns half
                    const rewardForBurn = await marketInstance.rewardForBurn(transferValue.div(2))
                    await assert.notRevert(marketInstance.from(accounts[1]).burn(transferValue.div(2)));

                    state = (await vaultInstance.fundingPhase(0))[4]
                    if(state == 2){ // Ended
                        break;
                    }

                    // Mints with the result of the burn to account 3
                    await (await marketInstance.from(accounts[1]).mint(accounts[2].signer.address, transferValue.div(2))).wait();
                    
                    // Accounts 2 & 3 send half to 4 & 5
                    const account2SendingShare = (await marketInstance.balanceOf(accounts[1].signer.address)).sub(pastBalance[1]).div(2);
                    const account3SendingShare = (await marketInstance.balanceOf(accounts[2].signer.address)).sub(pastBalance[2]).div(2);

                    await (await marketInstance.from(accounts[1]).transfer(accounts[3].signer.address, account2SendingShare))
                    await (await marketInstance.from(accounts[2]).transfer(accounts[4].signer.address, account3SendingShare))

                    // Distribute to the rest
                    const account4SendingShare = (await marketInstance.balanceOf(accounts[4].signer.address)).sub(pastBalance[4]).div(2);
                    const account5SendingShare = (await marketInstance.balanceOf(accounts[5].signer.address)).sub(pastBalance[5]).div(2);

                    await (await marketInstance.from(accounts[4]).transfer(accounts[6].signer.address, account4SendingShare))
                    await (await marketInstance.from(accounts[5]).transfer(accounts[7].signer.address, account5SendingShare))

                    const account7SendingShare = (await marketInstance.balanceOf(accounts[6].signer.address)).sub(pastBalance[6]).div(2);
                    const account8SendingShare = (await marketInstance.balanceOf(accounts[7].signer.address)).sub(pastBalance[7]).div(2);

                    await (await marketInstance.from(accounts[6]).transfer(accounts[8].signer.address, account7SendingShare))
                    await (await marketInstance.from(accounts[7]).transfer(accounts[9].signer.address, account8SendingShare))
                }
                catch(e){
                    console.log(e)
                    console.log(`${i} Had a crash`)
                }
            }
            // Withdrawing the tokens from the market 
            try {
                const vaultBalanceBeforeWithdraws = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);
                let phaseData = await vaultInstance.fundingPhase(0);
                await (await vaultInstance.from(creator).terminateMarket());
                const marketActivity = await marketInstance.active();

                assert(vaultBalanceBeforeWithdraws.toString() >= phaseData[0].toString(), "Vault balance is lower than phase goal");
                assert.equal(phaseData[4].toString(), 2, "Funding round has not ended");
                assert.equal(marketActivity, false, "Market has not been terminated");
         
                let balanceOfUserInMarketBeforeWithdraw = 0;
                let balanceOfUserInDaiBeforeWithdraw = 0;
                let balanceOfUserInMarketAfterWithdraw = 0;
                let balanceOfUserInDaiAfterWithdraw = 0;
                let balanceOfMarketBeforeWithdraw = 0;
                let balanceOfMarketAfterWithdraw = 0;
                let tokenSupplyBeforeWithdraw = 0;
                let tokenSupplyAfterWithdraw = 0;

                for (let index = 0; index < 10; index++) {
                    balanceOfUserInMarketBeforeWithdraw = await marketInstance.balanceOf(accounts[index].signer.address);
                    balanceOfUserInDaiBeforeWithdraw = await pseudoDaiInstance.balanceOf(accounts[index].signer.address);
                    balanceOfMarketBeforeWithdraw =  await pseudoDaiInstance.balanceOf(marketInstance.contract.address);
                    tokenSupplyBeforeWithdraw = await marketInstance.totalSupply();
                    // Withdrawing a 0 balance will result in a revert
                    if(balanceOfUserInMarketBeforeWithdraw.toString() != 0) {
                        let txReceipt = await (await marketInstance.from(accounts[index].signer.address).withdraw(balanceOfUserInMarketBeforeWithdraw)).wait();
    
                        balanceOfUserInMarketAfterWithdraw = await marketInstance.balanceOf(accounts[index].signer.address);
                        balanceOfUserInDaiAfterWithdraw = await pseudoDaiInstance.balanceOf(accounts[index].signer.address);
                        balanceOfMarketAfterWithdraw =  await pseudoDaiInstance.balanceOf(marketInstance.contract.address);
                        tokenSupplyAfterWithdraw = await marketInstance.totalSupply();

                        // User tests
                        assert(balanceOfUserInMarketBeforeWithdraw.toString() > balanceOfUserInMarketAfterWithdraw.toString(), "User has a bigger balance before withdrawing");
                        assert.equal(balanceOfUserInMarketAfterWithdraw.toString(), 0, "User has tokens in market after withdraw");
                        assert.notEqual(balanceOfUserInDaiAfterWithdraw.toString(), balanceOfUserInDaiBeforeWithdraw.toString(), "Use has less DAI after withdraw");
                        // Market tests
                        assert.notEqual(tokenSupplyBeforeWithdraw.toString(), tokenSupplyAfterWithdraw.toString(), "Token supply did not decrease with withdraw");
                        assert.notEqual(balanceOfMarketBeforeWithdraw.toString(), balanceOfMarketAfterWithdraw.toString(), "Market balance did not decrease with withdraw");
                    } else {
                        try {
                            await (await marketInstance.from(accounts[index].signer.address).withdraw(balanceOfUserInMarketBeforeWithdraw)).wait();
                            assert.equal(true, false, "Was able to withdraw with 0 tokens");
                        } catch (error) {
                            assert.equal(true, true, "Withdraw failed on 0 token balance");
                        }
                    }
                }
                // Ensuring the market has no supply or collateral
                balanceOfMarketAfterWithdraw =  await pseudoDaiInstance.balanceOf(marketInstance.contract.address);
                tokenSupplyAfterWithdraw = await marketInstance.totalSupply();

                assert.equal(balanceOfMarketAfterWithdraw.toString(), 0, "Market has left over collateral");
                assert.equal(tokenSupplyAfterWithdraw.toString(), 0, "Market has tokens after all withdraws");
            } catch (error) {
                console.log(`Had a crash`, error);
            }
        })
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