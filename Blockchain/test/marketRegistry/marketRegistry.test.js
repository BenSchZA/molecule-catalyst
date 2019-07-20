const etherlime = require('etherlime-lib');
const ethers = require('ethers');

let MarketAbi = require('../../build/Market.json');
let PseudoDaiTokenAbi = require('../../build/PseudoDaiToken.json');
let MoleculeVaultAbi = require('../../build/MoleculeVault.json');
let CurveRegistryAbi = require('../../build/CurveRegistry.json');
let MarketRegistryAbi = require('../../build/MarketRegistry.json');
let MarketFactoryAbi = require('../../build/MarketFactory.json');
let CurveFunctionsAbi = require('../../build/CurveFunctions.json');

// The user accounts are
const defaultDaiPurchase = 500;
const defaultTokenVolume = 100;

const moleculeVaultSettings = {
    taxationRate: ethers.utils.parseUnits("15", 0),
}

const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

let marketSettings = {
    fundingGoals: [
        ethers.utils.parseUnits("2000000"),
        ethers.utils.parseUnits("2500000"),
        ethers.utils.parseUnits("3000000")
    ],
    phaseDuration: [
        ethers.utils.parseUnits("12", 0),
        ethers.utils.parseUnits("8", 0),
        ethers.utils.parseUnits("6", 0)
    ],
    curveType: ethers.utils.parseUnits("0", 0),
    taxationRate: ethers.utils.parseUnits("60", 0),
    scaledShift: ethers.utils.parseUnits("500000000000000000", 0),
    gradientDenominator: ethers.utils.parseUnits("17000", 0),
}


describe('Market Registry test', () => {
    let molAdmin = accounts[1];
    let creator = accounts[2];
    let user1 = accounts[3];
    let user2 = accounts[4];
    let pseudoDaiInstance, moleculeVaultInstance, curveRegistryInstance, marketRegistryInstance, marketFactoryInstance, curveIntegralInstance;
  
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

        // TODO: register vyper curve
        marketFactoryInstance = await deployer.deploy(
            MarketFactoryAbi,
            false,
            pseudoDaiInstance.contract.address,
            moleculeVaultInstance.contract.address,
            marketRegistryInstance.contract.address,
            curveRegistryInstance.contract.address
        );

        await (await marketRegistryInstance.from(molAdmin).addMarketDeployer(marketFactoryInstance.contract.address, "Initial factory")).wait()
    });

    describe('Registry Functions', () => {
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
                    marketSettings.taxationRate,
                    marketSettings.gradientDenominator,
                    marketSettings.scaledShift
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
                marketSettings.taxationRate,
                marketSettings.gradientDenominator,
                marketSettings.scaledShift
            ));
        });
    });

    describe('Deployer Management', () => {
        it('Only admin registers a deployer', async () => {
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
                marketSettings.taxationRate,
                marketSettings.gradientDenominator,
                marketSettings.scaledShift
            ));

            await (await marketRegistryInstance.from(molAdmin).addMarketDeployer(secondMarketFactoryInstance.contract.address, "Initial factory")).wait()

            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate,
                marketSettings.gradientDenominator,
                marketSettings.scaledShift
            )).wait()

            let secondMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.notEqual(secondMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.notEqual(secondMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(secondMarketDataObj[2], creator.signer.address, "Contract registry creator incorrect")

        });

        it('Only admin deactivates a deactivates deployer', async () => {
            let firstMarketDataObj = await marketRegistryInstance.from(creator).getMarket(0);
            assert.equal(firstMarketDataObj[0], ethers.constants.AddressZero, "Contract registry address incorrect")
            assert.equal(firstMarketDataObj[1], ethers.constants.AddressZero, "Contract registry vault incorrect")
            assert.equal(firstMarketDataObj[2], ethers.constants.AddressZero, "Contract registry creator incorrect")

            await (await marketFactoryInstance.from(molAdmin).deployMarket(
                    marketSettings.fundingGoals,
                    marketSettings.phaseDuration,
                    creator.signer.address,
                    marketSettings.curveType,
                    marketSettings.taxationRate,
                    marketSettings.gradientDenominator,
                    marketSettings.scaledShift
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
                marketSettings.taxationRate,
                marketSettings.gradientDenominator,
                marketSettings.scaledShift
            ));
        });
    });

    describe("Events", () => {
        it("Emits Market Created", async () => {
            const txReceipt = await (await marketFactoryInstance.from(molAdmin).deployMarket(
                marketSettings.fundingGoals,
                marketSettings.phaseDuration,
                creator.signer.address,
                marketSettings.curveType,
                marketSettings.taxationRate,
                marketSettings.gradientDenominator,
                marketSettings.scaledShift
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
        })
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
        })
        it("Emits Deployer Removed", async () => {
            const txReceipt = await (await marketRegistryInstance.from(molAdmin).removeMarketDeployer(marketFactoryInstance.contract.address, "Deprecating")).wait()

            const deployerRemovedEvent = (await(txReceipt.events.filter(
                event => event.topics[0] == marketRegistryInstance.interface.events.DeployerRemoved.topic
            ))).map(deployRemovedLog => marketRegistryInstance.interface.parseLog(deployRemovedLog))[0]
            
            assert.equal(deployerRemovedEvent.values.deployer, marketFactoryInstance.contract.address, "Deloyer address incorrect");
            assert.equal(deployerRemovedEvent.values.reason, "Deprecating", "Deloyer version message incorrect");
        })
    })
    
    describe('Meta data', () =>{
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
                    marketSettings.taxationRate,
                    marketSettings.gradientDenominator,
                    marketSettings.scaledShift
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
                    marketSettings.taxationRate,
                    marketSettings.gradientDenominator,
                    marketSettings.scaledShift
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
    })

    describe("Admin Managed", () => {
        it("Only admin can add an admin", async () => {
            await assert.notRevert(marketRegistryInstance.from(molAdmin).addAdmin(user1.signer.address))
            await assert.revert(marketRegistryInstance.from(user2).addAdmin(user1.signer.address))
        }),
        it("Only admin can remove an admin", async () =>{
            await assert.notRevert(marketRegistryInstance.from(molAdmin).addAdmin(user1.signer.address))
            await assert.revert(marketRegistryInstance.from(user2).removeAdmin(user1.signer.address))

            await assert.notRevert(marketRegistryInstance.from(molAdmin).removeAdmin(user1.signer.address))
            
        }),
        describe("Meta Data", () => {
            it("Checks if admin", async () =>{
                let adminStatus = await marketRegistryInstance.from(molAdmin).isAdmin(user1.signer.address)
                assert.ok(!adminStatus, "Admin status incorrect")
                
                await assert.notRevert(marketRegistryInstance.from(molAdmin).addAdmin(user1.signer.address))
                
                adminStatus = await marketRegistryInstance.from(molAdmin).isAdmin(user1.signer.address)
                assert.ok(adminStatus, "Admin status not updated")
            })
        })
    })
})
