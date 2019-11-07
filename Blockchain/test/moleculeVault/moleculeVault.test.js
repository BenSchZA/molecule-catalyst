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
    molVaultSettings,
    marketSettings,
    MarketAbi,
    VaultAbi,
    defaultDaiPurchase,
    defaultTokenVolume,
    purchasingSequences
} = require("../testing.settings.js");

const BigNumber = require('bignumber.js');
 
describe("Molecule vault test", async () => {
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
            ));
        }
    });

    describe("Admin functions", async () => {
        beforeEach(async () => {
            const DECIMALS = 18;
            const EXPECTED_PRECISION = DECIMALS - 6;
            BigNumber.config({ DECIMAL_PLACES: EXPECTED_PRECISION });
            BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_UP });

            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101)
            let balanceOfMoleculeVault = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
 
            assert.ok(balanceOfMoleculeVault.eq(0), "Tokens already in the vault")

            let estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();

            await assert.notRevert(vaultInstance.from(creator).withdraw(), "Withdraw worked without the round being finished")

            balanceOfMoleculeVault = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            const targetBalance = phaseData[0].div(moleculeVaultSettings.taxationRate.add(100)).mul(moleculeVaultSettings.taxationRate);
            
            const balanceOfMoleculeVaultShifted = BigNumber(balanceOfMoleculeVault.toString())
                .shiftedBy(-DECIMALS)
                .decimalPlaces(EXPECTED_PRECISION);
            const targetBalanceShifted = BigNumber(targetBalance.toString())
                .shiftedBy(-DECIMALS)
                .decimalPlaces(EXPECTED_PRECISION);

            assert.equal(balanceOfMoleculeVaultShifted.toString(), targetBalanceShifted.toString(), "Tokens not transfered")
        });

        it('Executes approve correctly', async () =>{
            await assert.revert(moleculeVaultInstance.from(creator).approve(creator.signer.address, ethers.constants.MaxUint256), "Unauthorised approve fired")
            const approvalBefore = await pseudoDaiInstance.allowance(moleculeVaultInstance.contract.address, creator.signer.address)
            
            assert.ok(approvalBefore.eq(0), "Approval already set");
            
            await assert.notRevert(moleculeVaultInstance.from(molAdmin).approve(creator.signer.address, ethers.constants.MaxUint256), "Approve failed")
            
            const approvalAfter = await pseudoDaiInstance.allowance(moleculeVaultInstance.contract.address, creator.signer.address);
            
            assert.ok(approvalAfter.eq(ethers.constants.MaxUint256), "Approval already set");
        });

        it('Executes transfer correctly', async () => {
            const user2BalanceBefore = await pseudoDaiInstance.balanceOf(user2.signer.address);
            const balanceOfMoleculeVaultBefore = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            
            await assert.revert(moleculeVaultInstance.from(user2).transfer(user2.signer.address,balanceOfMoleculeVaultBefore), "Transfer incorrectly sent");
            await assert.notRevert(moleculeVaultInstance.from(molAdmin).transfer(user2.signer.address, balanceOfMoleculeVaultBefore), "Transfer failed to send");
            
            const user2BalanceAfter = await pseudoDaiInstance.balanceOf(user2.signer.address);
            const balanceOfMoleculeVaultAfter = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            
            assert.ok(user2BalanceBefore.lt(user2BalanceAfter), "Balance not increased");
            assert.ok(balanceOfMoleculeVaultBefore.gt(balanceOfMoleculeVaultAfter), "Balance of vault not decreased");
            assert.ok(balanceOfMoleculeVaultAfter.eq(0), "Not all funds were sent");
        });
    });

    describe("Vault interactions", async () => {
        it("Receives tax from vault withdraws", async () => {
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(101)
            let balanceOfMoleculeVault = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            
            assert.ok(balanceOfMoleculeVault.eq(0), "Tokens already in the vault")
            
            let estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            
            await assert.notRevert(vaultInstance.from(creator).withdraw(), "Withdraw failed");
            
            balanceOfMoleculeVault = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            const targetBalance = phaseData[0].div(moleculeVaultSettings.taxationRate.add(100)).mul(moleculeVaultSettings.taxationRate);
            
            assert.ok(balanceOfMoleculeVault.eq(targetBalance), "Tokens not transfered")
        });
    });

    describe("Molecule tax update tests", async () => {
        it("Vault and market deploy correctly with a 0% molecule tax", async () => {
            await moleculeVaultInstance.from(molAdmin).updateFeeRate(0);
            let feeRate = await moleculeVaultInstance.feeRate();

            assert.equal(feeRate.toString(), 0, "Taxation rate not set to 0");

            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate
            )).wait()
            
            const firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(1);
            marketInstance = await etherlime.ContractAt(MarketAbi, firstMarketDataObj[0]);
            vaultInstance = await etherlime.ContractAt(VaultAbi, firstMarketDataObj[1]);
            let phaseOne = await vaultInstance.fundingPhase(0);

            assert.equal(phaseOne[0].toString(), marketSettings.fundingGoals[0].toString(), "Mol tax was added to funding goal");

            let daiToSpendForPhase = (phaseOne[0].div(marketSettings.taxationRate)).mul(101)
            let balanceOfMoleculeVault = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            let balanceOfMarketInstance = await pseudoDaiInstance.balanceOf(marketInstance.contract.address);
            let balanceOfVaultInstance = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);

            assert.equal(balanceOfMoleculeVault.toString(), 0, "Tokens already in the mol vault");
            assert.equal(balanceOfMarketInstance.toString(), 0, "Tokens already in the market");
            assert.equal(balanceOfVaultInstance.toString(), 0, "Tokens already in the vault");

            let estimateTokens = await marketInstance.collateralToTokenBuying(daiToSpendForPhase)
            // Approving the new market as a spender
            await (await pseudoDaiInstance.from(user1).approve(
                marketInstance.contract.address,
                ethers.constants.MaxUint256
            ));
            // Minting tokens
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            let balanceOfMoleculeVaultM1 = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            let balanceOfMarketInstanceM1 = await pseudoDaiInstance.balanceOf(marketInstance.contract.address);
            let balanceOfVaultInstanceM1 = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);

            assert.equal(balanceOfMoleculeVaultM1.toString(), 0, "Tokens already in the mol vault");
            assert.equal(balanceOfMarketInstanceM1.toString(), molVaultSettings.marketBalances[0], "Market balance incorrect");
            assert.equal(balanceOfVaultInstanceM1.toString(), molVaultSettings.vaultBalances[0], "Market balance incorrect");
            
            await assert.notRevert(vaultInstance.from(creator).withdraw(), "Withdraw failed");

            let balanceOfMoleculeVaultW1 = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            let balanceOfMarketInstanceW1 = await pseudoDaiInstance.balanceOf(marketInstance.contract.address);
            let balanceOfVaultInstanceW1 = await pseudoDaiInstance.balanceOf(vaultInstance.contract.address);

            assert.equal(balanceOfMoleculeVaultW1.toString(), 0, "Tokens already in the mol vault");
            assert.equal(balanceOfMarketInstanceW1.toString(), molVaultSettings.marketBalances[1], "Market balance incorrect");
            assert.equal(balanceOfVaultInstanceW1.toString(), molVaultSettings.vaultBalances[1], "Market balance incorrect");
        });

        it('Changing tax rate will not affect existing markets', async () => {
            // Changing taxation rate for the first time
            await moleculeVaultInstance.from(molAdmin).updateFeeRate(0);
            let feeRate = await moleculeVaultInstance.feeRate();

            assert.equal(feeRate.toString(), 0, "Taxation rate not set to 0");

            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate
            )).wait()
            
            const firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(1);
            marketInstance = await etherlime.ContractAt(MarketAbi, firstMarketDataObj[0]);
            vaultInstance = await etherlime.ContractAt(VaultAbi, firstMarketDataObj[1]);
            let phaseOne = await vaultInstance.fundingPhase(0);

            // Changing taxation rate for the seccond time
            await moleculeVaultInstance.from(molAdmin).updateFeeRate(80);
            let feeRateM2 = await moleculeVaultInstance.feeRate();

            assert.equal(feeRateM2.toString(), 80, "Taxation rate not set to 80");

            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate
            )).wait()
            
            const secondMarketDataObj = await marketRegistryInstance.from(creator).getMarket(2);
            let vaultInstanceM2 = await etherlime.ContractAt(VaultAbi, secondMarketDataObj[1]);
            let phaseOneM2 = await vaultInstanceM2.fundingPhase(0);
            
            // Changing taxation rate a third time
            await moleculeVaultInstance.from(molAdmin).updateFeeRate(20);
            let feeRateM3 = await moleculeVaultInstance.feeRate();

            assert.equal(feeRateM3.toString(), 20, "Taxation rate not set to 80");

            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate
            )).wait()
            
            const thirdMarketDataObj = await marketRegistryInstance.from(creator).getMarket(3);
            let vaultInstanceM3 = await etherlime.ContractAt(VaultAbi, thirdMarketDataObj[1]);
            let phaseOneM3 = await vaultInstanceM3.fundingPhase(0);

            assert.equal(phaseOne[0].toString(), marketSettings.fundingGoals[0].toString(), "Incorrect mol tax was added to market");
            assert.equal(phaseOneM2[0].toString(), molVaultSettings.fundingValue[0], "Molecule taxation rate change does not reflect in new market");
            assert.equal(phaseOneM3[0].toString(), molVaultSettings.fundingValue[1], "Molecule taxation rate change does not reflect in new market");
        });
    });

    describe("Meta data", async () => {
        it('Get collateralToken', async () => {
            const collateralToken = await moleculeVaultInstance.collateralToken();
            assert.equal(collateralToken, pseudoDaiInstance.contract.address, "Collateral token invalid")
        });
        
        it('Get feeRate', async () => {
            const feeRate = await moleculeVaultInstance.feeRate();
            assert.ok(feeRate.eq(moleculeVaultSettings.taxationRate), "Tax rate not set")
        });
    });

    describe("Admin Managed Specific", async () => {
        it("Only admin can add an admin", async () => {
            await assert.notRevert(moleculeVaultInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))
            await assert.revert(moleculeVaultInstance.from(user2).addWhitelistAdmin(user1.signer.address))
        });

        it("Only admin can remove an admin", async () =>{
            await assert.notRevert(moleculeVaultInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))
            await assert.revert(moleculeVaultInstance.from(user2).renounceWhitelistAdmin())
            
            await assert.notRevert(moleculeVaultInstance.from(user1.signer.address).renounceWhitelistAdmin())
        });

        it("Only admin can approve collateral spending", async () =>{
            await assert.notRevert(moleculeVaultInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))
            await moleculeVaultInstance.from(user1.signer.address).approve(user2.signer.address, ethers.constants.MaxUint256);
            let approvedAmount = await pseudoDaiInstance.allowance(moleculeVaultInstance.contract.address, user2.signer.address);

            assert.equal(ethers.constants.MaxUint256.toString(), approvedAmount.toString(), "Approved collateral amount incorrect");
        });

        describe("Meta Data", async () => {
            it("Checks if admin", async () =>{
                let adminStatus = await moleculeVaultInstance.from(molAdmin).isWhitelistAdmin(user1.signer.address)
                assert.ok(!adminStatus, "Admin status incorrect")
                
                await assert.notRevert(moleculeVaultInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))
                
                adminStatus = await moleculeVaultInstance.from(molAdmin).isWhitelistAdmin(user1.signer.address)
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
