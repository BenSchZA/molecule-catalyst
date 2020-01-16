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
 
describe("Market Registry test", async () => {
    let insecureDeployer = accounts[0];
    let molAdmin = accounts[1];
    let creator = accounts[2];
    let user1 = accounts[3];
    let user2 = accounts[4];
    let admin2 = accounts[5];
    let backendMarketDeployer = accounts[6];
    let pseudoDaiInstance, moleculeVaultInstance, curveRegistryInstance, marketRegistryInstance, marketFactoryInstance, curveIntegralInstance;
  
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
        // Deploying the market
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
    });

    describe("Registry Functions", async () => {
        it('Registers factory from valid deployer', async () => {
            let firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.equal(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.equal(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], ethers.constants.AddressZero, "Contract registry creator incorrect")

            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                    marketSettings.fundingGoals,
                    marketSettings.phaseDuration,
                    creator.signer.address,
                    marketSettings.curveType,
                    marketSettings.taxationRate
                )).wait()

            firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.notEqual(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.notEqual(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], creator.signer.address, "Contract registry creator incorrect")

            // Adding unregistered factory
            const secondMarketFactoryInstance = await deployer.deploy(
                MarketFactoryAbi,
                false,
                pseudoDaiInstance.contract.address,
                moleculeVaultInstance.contract.address,
                marketRegistryInstance.contract.address,
                curveRegistryInstance.contract.address
            );

            await assert.revert(secondMarketFactoryInstance.from(creator).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate
            ));
        });
    });

    describe("Deployer Management", async () => {
        it('Only admin registers a deployer', async () => {
            const secondMarketFactoryInstance = await deployer.deploy(
                MarketFactoryAbi,
                false,
                pseudoDaiInstance.contract.address,
                moleculeVaultInstance.contract.address,
                marketRegistryInstance.contract.address,
                curveRegistryInstance.contract.address
            );
            // Adding the admins (in deployment this would be the multsig)
            await secondMarketFactoryInstance.from(insecureDeployer).init(
                molAdmin.signer.address,
                backendMarketDeployer.signer.address
            );
            
            await assert.revert(secondMarketFactoryInstance.from(creator).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate
            ));
            
            await (await marketRegistryInstance.from(molAdmin).addMarketDeployer(secondMarketFactoryInstance.contract.address, "Initial factory")).wait()
            
            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate
            )).wait()

            let secondMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.notEqual(secondMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.notEqual(secondMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(secondMarketDataObj[2], creator.signer.address, "Contract registry creator incorrect")
        });

        it('Only admin deactivates a deployer', async () => {
            let firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.equal(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.equal(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], ethers.constants.AddressZero, "Contract registry creator incorrect")

            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                    marketSettings.fundingGoals,
                    marketSettings.phaseDuration,
                    creator.signer.address,
                    marketSettings.curveType,
                    marketSettings.taxationRate
                )).wait()

            firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.notEqual(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.notEqual(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], creator.signer.address, "Contract registry creator incorrect")

            await (await marketRegistryInstance.from(molAdmin).removeMarketDeployer(marketFactoryInstance.contract.address, "Deprecating")).wait()
            
            await assert.revert(marketFactoryInstance.from(creator).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate
            ));
        });
    });

    describe("Events", async () => {
        it("Emits Market Created", async () => {
            const txReceipt = await (await marketFactoryInstance.from(molAdmin).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate
            )).wait();

            const marketCreatedEvent = (await(txReceipt.events.filter(
                event => event.topics[0] == marketRegistryInstance.interface.events.MarketCreated.topic
            ))).map(marketEvent => marketRegistryInstance.interface.parseLog(marketEvent))[0]
            
            let firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.equal(firstMarketDataObj[2], creator.signer.address, "Contract registry creator incorrect")

            assert.ok(marketCreatedEvent.values.index.eq(0), "Index incorrect");
            assert.equal(marketCreatedEvent.values.marketAddress, firstMarketDataObj[0], "Market address incorrect");
            assert.equal(marketCreatedEvent.values.vault, firstMarketDataObj[1], "Vault address incorrect");
            assert.equal(marketCreatedEvent.values.creator, creator.signer.address, "Creator address incorrect");
        });

        it("Emits Deployer Added", async () => {
            const secondMarketFactoryInstance = await deployer.deploy(
                MarketFactoryAbi,
                false,
                pseudoDaiInstance.contract.address,
                moleculeVaultInstance.contract.address,
                marketRegistryInstance.contract.address,
                curveRegistryInstance.contract.address
            );

            const txReceipt = await (await marketRegistryInstance.from(molAdmin).addMarketDeployer(secondMarketFactoryInstance.contract.address, "Initial factory")).wait()

            const deployerAddedEvent = (await(txReceipt.events.filter(
                event => event.topics[0] == marketRegistryInstance.interface.events.DeployerAdded.topic
            ))).map(deployAddedLog => marketRegistryInstance.interface.parseLog(deployAddedLog))[0]
            
            assert.equal(deployerAddedEvent.values.deployer, secondMarketFactoryInstance.contract.address, "Deloyer address incorrect");
            assert.equal(deployerAddedEvent.values.version, "Initial factory", "Deloyer version message incorrect");
        });

        it("Emits Deployer Removed", async () => {
            const txReceipt = await (await marketRegistryInstance.from(molAdmin).removeMarketDeployer(marketFactoryInstance.contract.address, "Deprecating")).wait()

            const deployerRemovedEvent = (await(txReceipt.events.filter(
                event => event.topics[0] == marketRegistryInstance.interface.events.DeployerRemoved.topic
            ))).map(deployRemovedLog => marketRegistryInstance.interface.parseLog(deployRemovedLog))[0]
            
            assert.equal(deployerRemovedEvent.values.deployer, marketFactoryInstance.contract.address, "Deloyer address incorrect");
            assert.equal(deployerRemovedEvent.values.reason, "Deprecating", "Deloyer version message incorrect");
        });
    });
    
    describe("Meta data", async () => {
        it('Get Market', async () => {
            let firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.equal(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.equal(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], ethers.constants.AddressZero, "Contract registry creator incorrect")

            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                    marketSettings.fundingGoals,
                    marketSettings.phaseDuration,
                    creator.signer.address,
                    marketSettings.curveType,
                    marketSettings.taxationRate
                )).wait()

            firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.notEqual(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.notEqual(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], creator.signer.address, "Contract registry creator incorrect")
        });

        it('Get index', async () => {
            let getIndex = await marketRegistryInstance.from(molAdmin).getIndex();
            assert.ok(getIndex.eq(0), "Starting index incorrect")

            let firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.equal(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.equal(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], ethers.constants.AddressZero, "Contract registry creator incorrect")

            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                    marketSettings.fundingGoals,
                    marketSettings.phaseDuration,
                    creator.signer.address,
                    marketSettings.curveType,
                    marketSettings.taxationRate
                )).wait()

            firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.notEqual(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.notEqual(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], creator.signer.address, "Contract registry creator incorrect")
            getIndex = await marketRegistryInstance.from(molAdmin).getIndex();

            assert.ok(getIndex.eq(1), "Index not incremented");
        });

        it('Is Market Deployer', async () => {
            const isMarketFalse = await marketRegistryInstance.from(molAdmin).isMarketDeployer(moleculeVaultInstance.contract.address);
            const isMarketTrue = await marketRegistryInstance.from(molAdmin).isMarketDeployer(marketFactoryInstance.contract.address);
            assert.equal(isMarketFalse, false, "Unauthrorised deployer registered");
            assert.equal(isMarketTrue, true, "Correct deployer not registered");
        });

        it('Published Block number', async () => {
            const publishedBlocknumber = await marketRegistryInstance.from(molAdmin).publishedBlocknumber();
            assert.ok(publishedBlocknumber.gt(0), "Published block not set")
        });
    });

    describe("Admin Managed", async () => {
        it("Only admin can add an admin", async () => {
            await assert.notRevert(marketRegistryInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))
            await assert.revert(marketRegistryInstance.from(user2).addWhitelistAdmin(user1.signer.address))
        });

        it("Only mol admin can remove an admin", async () =>{
            await assert.notRevert(marketRegistryInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))

            // Checks a normal admin cannot remove another admin
            await assert.revert(marketRegistryInstance.from(user1).removeWhitelistAdmin(molAdmin.signer.address))
            // Checks the super admin can remove another admin
            await assert.notRevert(marketRegistryInstance.from(molAdmin).removeWhitelistAdmin(user1.signer.address))
        });

        it("Admin can remove themselves as an admin", async () =>{
            await assert.notRevert(marketRegistryInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))

            // Checks a non admin cannot remove themselves
            await assert.revert(marketRegistryInstance.from(user2).renounceWhitelistAdmin())
            // Checks an admin can remove themselves as an admin
            await assert.notRevert(marketRegistryInstance.from(user1).renounceWhitelistAdmin())
        });

        it("One admin must always be present in the contract", async () =>{
            await assert.notRevert(marketRegistryInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))
            
            // A non admin may not remove themselves
            await assert.revert(marketRegistryInstance.from(user2).renounceWhitelistAdmin())
            // A admin may remove themselves
            await assert.notRevert(marketRegistryInstance.from(user1).renounceWhitelistAdmin())
            // Ensuring there is only 1 admin left in the contract
            let adminCount = await marketRegistryInstance.getAdminCount();
            assert.equal(
                adminCount.toString(),
                1,
                "Incorrect admin count"
            );
            // Mol admin should not be able to remove themselves as they are the last admin
            await assert.revert(marketRegistryInstance.from(molAdmin).renounceWhitelistAdmin());
            // Checking there is still the correct number of admins in the contract
            adminCount = await marketRegistryInstance.getAdminCount();
            assert.equal(
                adminCount.toString(),
                1,
                "Incorrect admin count"
            );
        });

        it("Initial admin can replace themselves", async () =>{
            await assert.notRevert(marketRegistryInstance.from(molAdmin).addNewInitialAdmin(user1.signer.address))

            await assert.revert(marketRegistryInstance.from(molAdmin).removeWhitelistAdmin(user1.signer.address))
            await assert.notRevert(marketRegistryInstance.from(user1).removeWhitelistAdmin(molAdmin.signer.address))
        });

        describe("Meta Data", async () => {
            it("Checks if admin", async () =>{
                let adminStatus = await marketRegistryInstance.from(molAdmin).isWhitelistAdmin(user1.signer.address)
                assert.ok(!adminStatus, "Admin status incorrect")
                
                await assert.notRevert(marketRegistryInstance.from(molAdmin).addWhitelistAdmin(user1.signer.address))
                
                adminStatus = await marketRegistryInstance.from(molAdmin).isWhitelistAdmin(user1.signer.address)
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
