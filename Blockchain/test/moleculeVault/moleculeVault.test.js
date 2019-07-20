const etherlime = require('etherlime-lib');
const ethers = require('ethers');

let MarketAbi = require('../../build/Market.json');
let VaultAbi = require('../../build/Vault.json');
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

    describe('Admin functions', () => {
        it('Executes transfer correctly');
        it('Executes approve correctly');
    });

    describe("Vault interactions", () => {
        it("Receives tax from vault withdraws")
    })

    describe('Meta data', () =>{
        it('Get collateralToken');
        it('Get taxRate');
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
