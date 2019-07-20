const etherlime = require('etherlime-lib');
const ethers = require('ethers');

let MarketAbi = require('../../build/Market.json');
let CurveFunctionsAbi = require('../../build/CurveFunctions.json');
let PseudoDaiTokenAbi = require('../../build/PseudoDaiToken.json');
let MoleculeVaultAbi = require('../../build/MoleculeVault.json');
let CurveRegistryAbi = require('../../build/CurveRegistry.json');
let MarketRegistryAbi = require('../../build/MarketRegistry.json');
let MarketFactoryAbi = require('../../build/MarketFactory.json');
let BondingFunctionsAbi = require('../../build/BondingFunctions.json');

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



describe('Curve Registry test', () => {
    let molAdmin = accounts[1];
    let creator = accounts[2];
    let user1 = accounts[3];
    let user2 = accounts[4];
    let pseudoDaiInstance, moleculeVaultInstance, curveRegistryInstance, marketRegistryInstance, marketFactoryInstance, curveIntegralInstance;

  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(molAdmin.secretKey);

        bondingFunctionsInstance = await deployer.deploy(
            BondingFunctions,
            false
        );

    });

    describe('Admin functions', async () => {
        it('Registers a curve');
        it('Deactivates a curve');
        it('Activates a curve');
    });

    describe('Meta data', async () => {
        it('Get curve address by index');
        it('Get curve data by index');
        it('Get index');
        it('Published Block number');
    });

    describe("Admin Managed Specific", () => {
        it("Only admin can add an admin", async () => {
            await assert.notRevert(curveRegistryInstance.from(molAdmin).addAdmin(user1.signer.address))
            await assert.revert(curveRegistryInstance.from(user2).addAdmin(user1.signer.address))
        }),
        it("Only admin can remove an admin", async () =>{
            await assert.notRevert(curveRegistryInstance.from(molAdmin).addAdmin(user1.signer.address))
            await assert.revert(curveRegistryInstance.from(user2).removeAdmin(user1.signer.address))

            await assert.notRevert(curveRegistryInstance.from(molAdmin).removeAdmin(user1.signer.address))
            
        }),
        describe("Meta Data", () => {
            it("Checks if admin", async () =>{
                let adminStatus = await curveRegistryInstance.from(molAdmin).isAdmin(user1.signer.address)
                assert.ok(!adminStatus, "Admin status incorrect")
                
                await assert.notRevert(curveRegistryInstance.from(molAdmin).addAdmin(user1.signer.address))
                
                adminStatus = await curveRegistryInstance.from(molAdmin).isAdmin(user1.signer.address)
                assert.ok(adminStatus, "Admin status not updated")
            })
        })
    })
})
