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
 
describe('Molecule vault test', () => {
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

    describe('Admin functions', () => {
        beforeEach(async () => {
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);

            let balanceOfMoleculeVault = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            assert.ok(balanceOfMoleculeVault.eq(0), "Tokens already in the vault")

            let estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            await assert.notRevert(vaultInstance.from(creator).withdraw(0), "Withdraw failed")

            balanceOfMoleculeVault = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            const targetBalance = phaseData[0].div(moleculeVaultSettings.taxationRate.add(100)).mul(moleculeVaultSettings.taxationRate);

            assert.ok(balanceOfMoleculeVault.eq(targetBalance), "Tokens not transfered")
        });

        it('Executes transfer correctly', async () =>{
            const user2BalanceBefore = await pseudoDaiInstance.balanceOf(user2.signer.address);
           
            const balanceOfMoleculeVaultBefore = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);

            await assert.revert(moleculeVaultInstance.from(user2).transfer(user2.signer.address,balanceOfMoleculeVaultBefore), "Transfer incorrectly sent");
           
            await assert.notRevert(moleculeVaultInstance.from(molAdmin).transfer(user2.signer.address, balanceOfMoleculeVaultBefore), "Transfer failed to send");

            const user2BalanceAfter = await pseudoDaiInstance.balanceOf(user2.signer.address);
           
            const balanceOfMoleculeVaultAfter = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);

            assert.ok(user2BalanceBefore.lt(user2BalanceAfter), "Balance not increased");

            assert.ok(balanceOfMoleculeVaultBefore.gt(balanceOfMoleculeVaultAfter), "Balance of vault not decreased");
            assert.ok(balanceOfMoleculeVaultAfter.eq(0), "Not all funds were sent");

        })
        it('Executes approve correctly', async () =>{
            await assert.revert(moleculeVaultInstance.from(creator).approve(creator.signer.address, ethers.constants.MaxUint256), "Unauthorised approve fired")
            const approvalBefore = await pseudoDaiInstance.allowance(moleculeVaultInstance.contract.address, creator.signer.address)
            assert.ok(approvalBefore.eq(0), "Approval already set");

            await assert.notRevert(moleculeVaultInstance.from(molAdmin).approve(creator.signer.address, ethers.constants.MaxUint256), "Approve failed")
            
            const approvalAfter = await pseudoDaiInstance.allowance(moleculeVaultInstance.contract.address, creator.signer.address);

            assert.ok(approvalAfter.eq(ethers.constants.MaxUint256), "Approval already set");
        });
    });

    describe("Vault interactions", () => {
        it("Receives tax from vault withdraws", async () =>{
            let phaseData = await vaultInstance.fundingPhase(0);
            let daiToSpendForPhase = (phaseData[0].div(marketSettings.taxationRate)).mul(100);

            let balanceOfMoleculeVault = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            assert.ok(balanceOfMoleculeVault.eq(0), "Tokens already in the vault")

            let estimateTokens = await marketInstance.colateralToTokenBuying(daiToSpendForPhase)
            await (await marketInstance.from(user1).mint(user1.signer.address, estimateTokens)).wait();
            await assert.notRevert(vaultInstance.from(creator).withdraw(0), "Withdraw failed")

            balanceOfMoleculeVault = await pseudoDaiInstance.balanceOf(moleculeVaultInstance.contract.address);
            const targetBalance = phaseData[0].div(moleculeVaultSettings.taxationRate.add(100)).mul(moleculeVaultSettings.taxationRate);

            assert.ok(balanceOfMoleculeVault.eq(targetBalance), "Tokens not transfered")
        })
    })

    describe('Meta data', () =>{
        it('Get collateralToken', async () =>{
            const collateralToken = await moleculeVaultInstance.collateralToken();
            assert.equal(collateralToken, pseudoDaiInstance.contract.address, "Collateral token invalid")
        });
        it('Get taxRate', async () => {
            const taxRate = await moleculeVaultInstance.taxRate();
            assert.ok(taxRate.eq(moleculeVaultSettings.taxationRate), "Tax rate not set")
        });
    })

    describe("Admin Managed Specific", () => {
        it("Only admin can add an admin", async () => {
            await assert.notRevert(moleculeVaultInstance.from(molAdmin).addAdmin(user1.signer.address))
            await assert.revert(moleculeVaultInstance.from(user2).addAdmin(user1.signer.address))
        }),
        it("Only admin can remove an admin", async () =>{
            await assert.notRevert(moleculeVaultInstance.from(molAdmin).addAdmin(user1.signer.address))
            await assert.revert(moleculeVaultInstance.from(user2).removeAdmin(user1.signer.address))

            await assert.notRevert(moleculeVaultInstance.from(molAdmin).removeAdmin(user1.signer.address))
            
        }),
        describe("Meta Data", () => {
            it("Checks if admin", async () =>{
                let adminStatus = await moleculeVaultInstance.from(molAdmin).isAdmin(user1.signer.address)
                assert.ok(!adminStatus, "Admin status incorrect")
                
                await assert.notRevert(moleculeVaultInstance.from(molAdmin).addAdmin(user1.signer.address))
                
                adminStatus = await moleculeVaultInstance.from(molAdmin).isAdmin(user1.signer.address)
                assert.ok(adminStatus, "Admin status not updated")
            })
        })
    })
})
