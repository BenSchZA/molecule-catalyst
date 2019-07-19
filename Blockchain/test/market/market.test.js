// const etherlime = require('etherlime-lib');
// const ethers = require('ethers');

// var PseudoDaiToken = require('../../build/PseudoDaiToken.json');
// let BondingFunctions = require('../../build/BondingFunctions.json');
// let MarketAbi = require('../../build/Market.json');

// const defaultDaiPurchase = 500;
// const defaultTokenVolume = 100;

// const marketInitSettings = {
//     taxationRate: 60,
//     creatorVault: "0x",
//     curveLibrary: "0x",
//     collateralToken: "0x"
// }

// const daiSettings = {
//     name: "PDAI",
//     symbol: "PDAI",
//     decimals: 18
// }

// describe('Market test', () => {
//     let deployer;
//     let molAdmin = accounts[0];
//     let userAccount = accounts[1];
//     let marketInstance, pseudoDaiInstance;
  
//     beforeEach('', async () => {
//         deployer = new etherlime.EtherlimeGanacheDeployer(molAdmin.secretKey);

//         pseudoDaiInstance = await deployer.deploy(
//             PseudoDaiToken, 
//             false, 
//             daiSettings.name, 
//             daiSettings.symbol, 
//             daiSettings.decimals
//         );

//         marketInstance = await deployer.deploy(
//             MarketAbi,
//             false
//         );

//     });

    describe('Token functionality', async () => {
        describe('Bonded creation curve functionality', async () => {
            it('Mints tokens', async () => {
                let priceOfMint = await marketInstance
                    .from(userAccount.signer.address)
                    .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18));
                let userPDAIBalance = await pseudoDaiInstance.from(
                    userAccount.signer.address
                ).balanceOf(
                    userAccount.signer.address
                );
    
                await pseudoDaiInstance.from(userAccount.signer.address).mint();
                await pseudoDaiInstance.from(userAccount.signer.address)
                    .approve(
                        marketInstance.contract.address,
                        priceOfMint
                    );
                let approvedAmount = await pseudoDaiInstance
                    .from(userAccount.signer.address)
                    .allowance(
                        userAccount.signer.address,
                        marketInstance.contract.address
                );
                assert.equal(
                    approvedAmount.toString(), 
                    priceOfMint.toString(),
                    "The contract has the incorrect PDAI allowance"
                );

                await marketInstance
                    .from(userAccount.signer.address)
                    .mint(
                        userAccount.signer.address, 
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                let userTokenBalance = await marketInstance
                    .from(userAccount.signer.address)
                    .balanceOf(
                        userAccount.signer.address
                );
                let userPDAIBalanceAfter = await pseudoDaiInstance
                    .from(userAccount.signer.address)
                    .balanceOf(
                        userAccount.signer.address
                );

//                 let proteaPDAIBalanceAfter = ethers.utils.formatUnits(
//                     await pseudoDaiInstance
//                         .from(proteaAdmin.signer.address)
//                         .balanceOf(
//                         proteaAdmin.signer.address
//                     ), 
//                     18
//                 );

//                 assert.equal(
//                     ethers.utils.formatUnits(userTokenBalance, 18),
//                     (defaultTokenVolume - (defaultTokenVolume * (communitySettings.contributionRate / 100))),
//                     "User dos not have tokens"
//                 );

//                 assert.notEqual(
//                     userPDAIBalanceAfter.toString(),
//                     userPDAIBalance.toString(),
//                     "Users PDAI has not decreased"
//                 );

//                 const onePercentContribution = ethers.utils.formatUnits(priceOfMint.div(101), 18);
//                 assert.equal(
//                     proteaPDAIBalanceAfter,
//                     onePercentContribution,
//                     "Contribution not sent correctly"
//                 )
//             });

            it('Burning tests', async () => {
                let priceOfMint = await marketInstance
                    .from(userAccount.signer.address)
                    .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                let userPDAIBalanceBeforeMint = await pseudoDaiInstance
                    .from(userAccount.signer.address)
                    .balanceOf(
                        userAccount.signer.address
                );
    
                await pseudoDaiInstance.from(userAccount.signer.address).mint();
                await pseudoDaiInstance
                    .from(userAccount.signer.address)
                    .approve(
                        marketInstance.contract.address,
                        priceOfMint
                );
                let approvedAmount = await pseudoDaiInstance
                    .from(communityCreatorAccount.signer.address)
                    .allowance(
                        userAccount.signer.address,
                        marketInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await marketInstance
                    .from(userAccount.signer.address)
                    .mint(
                        userAccount.signer.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                let userTokenBalanceAfterMint = await marketInstance
                    .from(userAccount.signer.address)
                    .balanceOf(
                        userAccount.signer.address
                );
                let userPDAIBalanceAfterMint = await pseudoDaiInstance
                    .from(userAccount.signer.address)
                    .balanceOf(
                        userAccount.signer.address
                );
                assert.equal(
                    ethers.utils.formatUnits(userTokenBalanceAfterMint, 18),
                    (defaultTokenVolume - (defaultTokenVolume * (communitySettings.contributionRate / 100))),
                    "User does not have tokens"
                );
                assert.notEqual(
                    userPDAIBalanceAfterMint,
                    userPDAIBalanceBeforeMint,
                    "Users PDAI has not decreased"
                );



                // Check reward for burn
                let currentBalance = await marketInstance
                    .from(userAccount.signer.address)
                    .balanceOf(
                        userAccount.signer.address
                );
                let rewardforBurnDAI = await marketInstance
                    .from(userAccount.signer.address)
                    .rewardForBurn(
                        currentBalance
                );

                // Check volume for withdraw
                let rewardforBurnToken = await marketInstance
                    .from(userAccount.signer.address)
                    .colateralToTokenSelling(
                        rewardforBurnDAI
                );

//                 assert.equal(
//                     ethers.utils.formatUnits(currentBalance, 18),
//                     ethers.utils.formatUnits(rewardforBurnToken, 18),
//                     "Issue in burn calculation"
//                 )
                

                await marketInstance
                    .from(userAccount.signer.address)
                    .burn(userTokenBalanceAfterMint.div(2));
                let userTokenBalanceAfterBurn = await marketInstance
                    .from(userAccount.signer.address)
                    .balanceOf(
                        userAccount.signer.address
                );
                let userPDAIBalanceAfterBurn = await pseudoDaiInstance
                    .from(userAccount.signer.address)
                    .balanceOf(
                        userAccount.signer.address
                );
                assert.notEqual(
                    ethers.utils.formatUnits(userPDAIBalanceAfterBurn, 18),
                    ethers.utils.formatUnits(userPDAIBalanceAfterMint, 18),
                    "Users PDAI balance has not changed between mint and burn"
                );
                assert.notEqual(
                    ethers.utils.formatUnits(userTokenBalanceAfterBurn, 18),
                    ethers.utils.formatUnits(userTokenBalanceAfterMint, 18),
                    "Users token balance has not changed between mint and burn"
                );
                assert.equal(
                    ethers.utils.formatUnits(userTokenBalanceAfterBurn, 18),
                    50 - (50 * (communitySettings.contributionRate / 100)),
                    "Users has incorrect token balance"
                );
            });

            it("Returns burning values correctly", async () => {
                let priceOfMint = await marketInstance
                    .from(userAccount.signer.address)
                    .priceToMint(ethers.utils.parseUnits(`1`, 18)
                );
                let userPDAIBalanceBeforeMint = await pseudoDaiInstance
                    .from(userAccount.signer.address)
                    .balanceOf(
                        userAccount.signer.address
                );

                await pseudoDaiInstance.from(userAccount.signer.address).mint();
                await pseudoDaiInstance
                    .from(userAccount.signer.address)
                    .approve(
                        marketInstance.contract.address,
                        priceOfMint
                );
                let approvedAmount = await pseudoDaiInstance
                    .from(communityCreatorAccount.signer.address)
                    .allowance(
                        userAccount.signer.address,
                        marketInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await marketInstance
                    .from(userAccount.signer.address)
                    .mint(
                        userAccount.signer.address,
                        ethers.utils.parseUnits(`1`, 18)
                );
                let userBalance = await marketInstance
                    .from(userAccount.signer.address)
                    .balanceOf(
                        userAccount.signer.address
                );

                let rewardforBurnDAI = await marketInstance
                    .from(userAccount.signer.address)
                    .rewardForBurn(
                        userBalance
                );

                // Check volume for withdraw
                let rewardforBurnToken = await marketInstance
                    .from(userAccount.signer.address)
                    .colateralToTokenSelling(
                        rewardforBurnDAI
                );

//                 assert.equal(
//                     ethers.utils.formatUnits(userBalance, 18),
//                     ethers.utils.formatUnits(rewardforBurnToken, 18),
//                     "Issue in burn calculation"
//                 )

                let priceOfMint2 = await marketInstance
                    .from(userAccount.signer.address)
                    .priceToMint(ethers.utils.parseUnits(`1`, 18)
                );
            })

            it('Curve gradient test', async () => {
                let priceOfOneBefore = await marketInstance
                    .from(userAccount.signer.address)
                    .priceToMint(ethers.utils.parseUnits("1", 18)
                );
                let priceOfMint = await marketInstance
                    .from(userAccount.signer.address)
                    .priceToMint(ethers.utils.parseUnits("10", 18)
                );
    
                await pseudoDaiInstance.from(userAccount.signer.address).mint();
                await pseudoDaiInstance.from(userAccount.signer.address)
                    .approve(
                        marketInstance.contract.address,
                        priceOfMint
                    );
                let approvedAmount = await pseudoDaiInstance
                    .from(userAccount.signer.address)
                    .allowance(
                        userAccount.signer.address,
                        marketInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await marketInstance
                    .from(userAccount.signer.address)
                    .mint(
                        userAccount.signer.address,
                        ethers.utils.parseUnits("10", 18)
                );
                let oneTokenPrice = await marketInstance
                    .from(userAccount.signer.address)
                    .priceToMint(ethers.utils.parseUnits("1", 18)
                );
                assert.notEqual(
                    ethers.utils.formatUnits(priceOfOneBefore, 18),
                    ethers.utils.formatUnits(oneTokenPrice, 18),
                    "The price to mint 1 token has not changed after minting"
                );
            });

//             it("Sends contribution amount to revenue target on purchase", async () => {
//                 const tokenVolume = ethers.utils.parseUnits(`${defaultTokenVolume}`, 18);

                let priceOfMint = await marketInstance
                    .from(userAccount.signer.address)
                    .priceToMint(tokenVolume);
                let userPDAIBalance = await pseudoDaiInstance.from(
                    userAccount.signer.address
                ).balanceOf(
                    userAccount.signer.address
                );
    
                await pseudoDaiInstance.from(userAccount.signer.address).mint();
                await pseudoDaiInstance.from(userAccount.signer.address)
                    .approve(
                        marketInstance.contract.address,
                        priceOfMint
                    );
                
                await marketInstance
                    .from(userAccount.signer.address)
                    .mint(
                        userAccount.signer.address, 
                        tokenVolume
                );

//                 const balance = await pseudoDaiInstance
//                         .from(proteaAdmin.signer.address)
//                         .balanceOf(
//                             userAccount.signer.address
//                     );

//                 assert.notEqual(ethers.utils.formatUnits(balance, 18), ethers.utils.formatUnits(tokenVolume, 18), "Tokens were not contributed");

                const revenueTargetBalance = await marketInstance
                        .from(proteaAdmin.signer.address)
                        .balanceOf(
                            communityCreatorAccount.signer.address
                    );

//                 assert.notEqual(
//                     parseFloat(ethers.utils.formatUnits(revenueTargetBalance,18)), 
//                     0, 
//                     "Tokens were not contributed");
//             })
            
//         });

//         it("Changes contribution target successfully", async ()=>{
//             const tokenVolume = ethers.utils.parseUnits(`${defaultTokenVolume}`, 18);

            let priceOfMint = await marketInstance
                .from(userAccount.signer.address)
                .priceToMint(tokenVolume);
            let userPDAIBalance = await pseudoDaiInstance.from(
                userAccount.signer.address
            ).balanceOf(
                userAccount.signer.address
            );

            await pseudoDaiInstance.from(userAccount.signer.address).mint();
            await pseudoDaiInstance.from(userAccount.signer.address)
                .approve(
                    marketInstance.contract.address,
                    priceOfMint
                );
            
            await marketInstance
                .from(userAccount.signer.address)
                .mint(
                    userAccount.signer.address, 
                    tokenVolume
            );

//             const balance = await pseudoDaiInstance
//                     .from(proteaAdmin.signer.address)
//                     .balanceOf(
//                         userAccount.signer.address
//                 );

//             assert.notEqual(ethers.utils.formatUnits(balance, 18), ethers.utils.formatUnits(tokenVolume, 18), "Tokens were not contributed");

            const revenueTargetBalance = await marketInstance
                    .from(proteaAdmin.signer.address)
                    .balanceOf(
                        communityCreatorAccount.signer.address
                );

//             assert.notEqual(
//                 parseFloat(ethers.utils.formatUnits(revenueTargetBalance,18)), 
//                 0, 
//                 "Tokens were not contributed");
                
            
            // Changing targets
            let targetAddress = await marketInstance.revenueTarget();
            await (await marketInstance.from(communityCreatorAccount).changeContributionTarget(anotherCommunityCreatorAccount.signer.address)).wait()
            targetAddress = await marketInstance.revenueTarget();
            assert.equal(
                anotherCommunityCreatorAccount.signer.address,
                targetAddress,
                "Address not updated"
            )
            priceOfMint = await marketInstance
                .from(userAccount.signer.address)
                .priceToMint(tokenVolume);

            await pseudoDaiInstance.from(userAccount.signer.address)
                .approve(
                    marketInstance.contract.address,
                    priceOfMint
                );
        
            let newRevenueTargetBalance = await marketInstance
                .from(proteaAdmin.signer.address)
                .balanceOf(
                    anotherCommunityCreatorAccount.signer.address
            );

//             assert.equal(
//                 parseFloat(ethers.utils.formatUnits(newRevenueTargetBalance,18)), 
//                 0, 
//                 "Balance incorrect");
            
            await marketInstance
                .from(userAccount.signer.address)
                .mint(
                    userAccount.signer.address, 
                    tokenVolume
            );

            newRevenueTargetBalance = await marketInstance
                    .from(proteaAdmin.signer.address)
                    .balanceOf(
                        anotherCommunityCreatorAccount.signer.address
                );

//             assert.notEqual(
//                 parseFloat(ethers.utils.formatUnits(revenueTargetBalance,18)), 
//                 0, 
//                 "Tokens were not contributed");
//         })

        describe('Moving along the curve', async () => {
            it('Total supply changes with minting and burning', async () => {
                let priceOfMint = await marketInstance
                    .from(userAccount.signer.address)
                    .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                await pseudoDaiInstance.from(userAccount.signer.address).mint();
                await pseudoDaiInstance.from(userAccount.signer.address)
                    .approve(
                        marketInstance.contract.address,
                        priceOfMint
                    );
                let totalSupplyBeforeMinting = await marketInstance
                    .from(userAccount.signer.address)
                    .totalSupply();
                await marketInstance
                    .from(userAccount.signer.address)
                    .mint(
                        userAccount.signer.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                let totalSupplyAfterMinting = await marketInstance
                    .from(userAccount.signer.address)
                    .totalSupply();
                await marketInstance
                    .from(userAccount.signer.address)
                    .burn(ethers.utils.parseUnits(`${defaultTokenVolume / 2}`, 18)
                );
                let totalSupplyAfterBurning = await marketInstance
                    .from(userAccount.signer.address)
                    .totalSupply();
                assert.notEqual(
                    ethers.utils.formatUnits(totalSupplyBeforeMinting, 18),
                    ethers.utils.formatUnits(totalSupplyAfterMinting, 18),
                    "Total supply has not changed after minting"
                );
                assert.notEqual(
                    ethers.utils.formatUnits(totalSupplyAfterMinting, 18),
                    ethers.utils.formatUnits(totalSupplyAfterBurning, 18),
                    "Total supply has not changed after burning"
                );
                assert.equal(
                    ethers.utils.formatUnits(totalSupplyBeforeMinting, 18),
                    0,
                    "Total supply is not 0 before minting"
                );
                assert.equal(
                    ethers.utils.formatUnits(totalSupplyAfterMinting, 18),
                    defaultTokenVolume,
                    `Total supply is not ${defaultTokenVolume} after minting ${defaultTokenVolume}`
                );
                assert.equal(
                    ethers.utils.formatUnits(totalSupplyAfterBurning, 18),
                    defaultTokenVolume / 2,
                    "Total supply is not affected by burning"
                );
            });

//             it("DAI for Token resolving functioning accurately", async () => {

                let tokenToDaiBN = await marketInstance
                .from(userAccount.signer.address)
                .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume * 2}`, 18));

//                 let finalTokenToDai = ethers.utils.formatUnits(tokenToDaiBN, 18);

                let daiToTokenBN = await marketInstance
                    .from(userAccount.signer.address)
                    .colateralToTokenBuying(ethers.utils.parseUnits(finalTokenToDai, 18));
                let finalDaiToToken = ethers.utils.formatUnits(daiToTokenBN, 18);

                tokenToDaiBN = await marketInstance
                .from(userAccount.signer.address)
                .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18));

//                 let firstTokenToDai = ethers.utils.formatUnits(tokenToDaiBN, 18);

                daiToTokenBN = await marketInstance
                    .from(userAccount.signer.address)
                    .colateralToTokenBuying(ethers.utils.parseUnits(firstTokenToDai, 18));
                let firstDaiToToken = ethers.utils.formatUnits(daiToTokenBN, 18);

//                 assert.equal(
//                     parseFloat(firstDaiToToken),
//                     defaultTokenVolume,
//                     "First Dai to token Volume valuation incorrect"
//                 )

                await pseudoDaiInstance.from(userAccount.signer.address).mint();
                await pseudoDaiInstance.from(userAccount.signer.address)
                    .approve(
                        marketInstance.contract.address,
                        tokenToDaiBN
                    );

                await marketInstance
                    .from(userAccount.signer.address)
                    .mint(
                        userAccount.signer.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );

                // Test case 2
                tokenToDaiBN = await marketInstance
                .from(userAccount.signer.address)
                .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18));

//                 let secondTokenToDai = ethers.utils.formatUnits(tokenToDaiBN, 18);

                daiToTokenBN = await marketInstance
                    .from(userAccount.signer.address)
                    .colateralToTokenBuying(ethers.utils.parseUnits(secondTokenToDai, 18));
                
//                 let secondDaiToToken = ethers.utils.formatUnits(daiToTokenBN, 18);

//                 assert.equal(
//                     parseFloat(secondDaiToToken),
//                     defaultTokenVolume,
//                     "Second Dai to token Volume valuation incorrect"
//                 );

//                 assert.ok(
//                     parseFloat(firstTokenToDai) < parseFloat(secondTokenToDai),
//                     "The price has not increased"
//                 );

//                 assert.equal(
//                     parseFloat(firstTokenToDai) + parseFloat(secondTokenToDai),
//                     parseFloat(finalTokenToDai),
//                     "Intergral valuations inccorect"
//                 );

//                 assert.equal(
//                     parseFloat(firstDaiToToken) + parseFloat(secondDaiToToken),
//                     parseFloat(finalDaiToToken),
//                     "Intergral valuations inccorect"
//                 )
//             })

//             it("Large purchases", async () => {
//                 for(let i = 0; i < 10; i++){
//                     if(accounts[i].signer.address == communityCreatorAccount.signer.address) {
//                         return;
//                     }
//                     // TODO: Skip revenue target
//                     await pseudoDaiInstance.from(accounts[i].signer.address).mint();

//                     let balance = ethers.utils.formatUnits(await pseudoDaiInstance.from(accounts[i].signer.address)
//                         .balanceOf(accounts[i].signer.address), 18);

                    let daiToTokenBN = await marketInstance
                        .from(accounts[i])
                        .colateralToTokenBuying(ethers.utils.parseUnits(balance, 18));

//                     let daiToToken = ethers.utils.formatUnits(daiToTokenBN, 18);

                    await pseudoDaiInstance.from(accounts[i].signer.address)
                        .approve(
                            marketInstance.contract.address,
                            ethers.utils.parseUnits(balance, 18)
                        );

                    await marketInstance
                        .from(accounts[i].signer.address)
                        .mint(
                            accounts[i].signer.address,
                            ethers.utils.parseUnits(daiToToken, 18)
                    );

                    let communityBalance = ethers.utils.formatUnits(await marketInstance.from(accounts[i].signer.address)
                        .balanceOf(accounts[i].signer.address), 18);
                    
//                     assert.equal(
//                         parseFloat(communityBalance),
//                         parseFloat(daiToToken) - (parseFloat(daiToToken) * (communitySettings.contributionRate / 100)),
//                         `${i} Balance incorrect`
//                     )// This should fail 
//                 }
//             })

            it("DAI pricing holds up at scale", async () => {
                // Setting the mint
                await pseudoDaiInstance.from(userAccount.signer.address).mint();
                for(let i = 0; i < 19; i++){
                    let tokenToDaiBN = await marketInstance
                        .from(userAccount.signer.address)
                        .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18));

//                     let tokenToDai = ethers.utils.formatUnits(tokenToDaiBN, 18);

                    let daiToTokenBN = await marketInstance
                        .from(userAccount.signer.address)
                        .colateralToTokenBuying(ethers.utils.parseUnits(tokenToDai, 18));
                    let daiToToken = ethers.utils.formatUnits(daiToTokenBN, 18);

//                     assert.equal(
//                         parseFloat(daiToToken),
//                         defaultTokenVolume,
//                         `${i} - Dai to token Volume valuation incorrect`
//                     )

                    await pseudoDaiInstance.from(userAccount.signer.address)
                        .approve(
                            marketInstance.contract.address,
                            tokenToDaiBN
                        );

                    await marketInstance
                        .from(userAccount.signer.address)
                        .mint(
                            userAccount.signer.address,
                            ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                    );

                    let balance = ethers.utils.formatUnits(await marketInstance.from(communityCreatorAccount.signer.address)
                            .balanceOf(userAccount.signer.address), 18);

//                     assert.equal(
//                         parseFloat(balance),
//                         ((defaultTokenVolume + (defaultTokenVolume * i)) - (defaultTokenVolume + (defaultTokenVolume * i)) * parseFloat(communitySettings.contributionRate / 100)),
//                         `${i} Balance incorrect`
//                     )
//                 }
//             })
//         })

        describe('Transferring', async () => {
            it('Transferring functionality', async () => {
                let priceOfMint = await marketInstance
                    .from(communityCreatorAccount.signer.address)
                    .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                await pseudoDaiInstance.from(communityCreatorAccount.signer.address).mint();
                await pseudoDaiInstance.from(communityCreatorAccount.signer.address)
                    .approve(
                        marketInstance.contract.address,
                        priceOfMint
                    );
                let approvedAmount = await pseudoDaiInstance
                    .from(communityCreatorAccount.signer.address)
                    .allowance(
                        communityCreatorAccount.signer.address,
                        marketInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await marketInstance
                    .from(communityCreatorAccount.signer.address)
                    .mint(
                        communityCreatorAccount.signer.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                await marketInstance
                    .from(communityCreatorAccount.signer.address)
                    .approve(
                        anotherCommunityCreatorAccount.signer.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume / 2}`, 18)
                );
                await marketInstance.from(anotherCommunityCreatorAccount.signer.address).transferFrom(
                    communityCreatorAccount.signer.address,
                    anotherCommunityCreatorAccount.signer.address,
                    ethers.utils.parseUnits(`${defaultTokenVolume / 2}`, 18),
                );
                let userTokenBalance = await marketInstance.from(
                    communityCreatorAccount.signer.address
                    ).balanceOf(
                        communityCreatorAccount.signer.address
                );
                let otherUserTokenBalance = await marketInstance.from(
                    anotherCommunityCreatorAccount.signer.address
                    ).balanceOf(
                        anotherCommunityCreatorAccount.signer.address
                );
                assert.equal(
                    ethers.utils.formatUnits(userTokenBalance, 18),
                    ethers.utils.formatUnits(otherUserTokenBalance, 18),
                    "Tokens where not transferer to other address"
                );
            });
        });

        describe("Meta data view tests", async () => {
            it("Total Supply", async () => {
                await pseudoDaiInstance.from(userAccount.signer.address).mint();
                let totalSupply = ethers.utils.formatUnits(
                    await marketInstance.from(
                        userAccount.signer.address
                        ).totalSupply(),
                    18
                );

//                 assert.equal(
//                     totalSupply,
//                     0,
//                     "Pool balance is not 0"
//                 )

                let tokenToDaiBN = await marketInstance
                    .from(userAccount.signer.address)
                    .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18));

                await pseudoDaiInstance
                .from(userAccount.signer.address)
                    .approve(
                        marketInstance.contract.address,
                        tokenToDaiBN
                    );

                await marketInstance
                    .from(userAccount.signer.address)
                    .mint(
                        userAccount.signer.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );

                totalSupply = ethers.utils.formatUnits(
                    await marketInstance.from(
                        userAccount.signer.address
                        ).totalSupply(),
                    18
                );

//                 assert.equal(
//                     totalSupply,
//                     defaultTokenVolume,
//                     `Total supply is incorrect`
//                 )
//             })

            it("Taxation rate", async () => {
                let contributionRate = await marketInstance.from(
                        proteaAdmin.signer.address
                    ).taxationRate();
                
//                 // assert.equal(
//                 //     parseFloat(ethers.utils.formatUnits(contributionRate, 2)),
//                 //     0.1,
//                 //     "Rate incorrect"
//                 // )
//             })
//         })
//     });

//     describe('Meta data', async () =>{
//         it('Get curve address by index');
//         it('Get curve data by index');
//         it('Get index');
//         it('Published Block number');

//     })
// })
