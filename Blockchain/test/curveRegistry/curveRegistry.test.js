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



describe('Curve Registry test', () => {
    let molAdmin = accounts[1];
    let creator = accounts[2];
    let user1 = accounts[3];
    let user2 = accounts[4];
    let pseudoDaiInstance, moleculeVaultInstance, curveRegistryInstance, marketRegistryInstance, marketFactoryInstance, curveIntegralInstance;

  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(molAdmin.secretKey);

        curveRegistryInstance = await deployer.deploy(
            CurveRegistryAbi,
            false
        );
        
        curveIntegralInstance = await deployer.deploy(
            CurveFunctionsAbi,
            false
        );

    });

    describe('Admin functions', () => {
        it('Registers a curve', async () => {
            await assert.revert(curveRegistryInstance.from(user1).registerCurve(
                curveIntegralInstance.contract.address,
                "y-axis shift"
            ));
            await assert.notRevert(curveRegistryInstance.from(molAdmin).registerCurve(
                curveIntegralInstance.contract.address,
                "y-axis shift"
            ));
        });
        it('Deactivates a curve', async () =>{
            await assert.notRevert(curveRegistryInstance.from(molAdmin).registerCurve(
                curveIntegralInstance.contract.address,
                "y-axis shift"
            ));

            await assert.revert(curveRegistryInstance.from(user1).deactivateCurve(0));
            await assert.notRevert(curveRegistryInstance.from(molAdmin).deactivateCurve(0));
        });
        it('Activates a curve', async () => {
            await assert.notRevert(curveRegistryInstance.from(molAdmin).registerCurve(
                curveIntegralInstance.contract.address,
                "y-axis shift"
            ));
            await assert.notRevert(curveRegistryInstance.from(molAdmin).deactivateCurve(0));

            await assert.revert(curveRegistryInstance.from(user1).reactivateCurve(0));
            await assert.notRevert(curveRegistryInstance.from(molAdmin).reactivateCurve(0));
        });
    });

    describe("Events", () =>{
        it("Emits curve registered", async () =>{
            const txReceipt = await (await curveRegistryInstance.from(molAdmin).registerCurve(
                curveIntegralInstance.contract.address,
                "y-axis shift"
            )).wait();

            const curveRegisteredEvent = (await(txReceipt.events.filter(
                event => event.topics[0] == curveRegistryInstance.interface.events.CurveRegisterd.topic
            ))).map(curveEvent => curveRegistryInstance.interface.parseLog(curveEvent))[0]
            
            const curveData = await curveRegistryInstance.getCurveData(0);

            assert.ok(curveRegisteredEvent.values.index.eq(0), "Index incorrect")
            assert.equal(curveRegisteredEvent.values.libraryAddress, curveData[0], "Address incorrect")
            assert.equal(curveRegisteredEvent.values.curveFunction, curveData[1], "Title not set")
        })
    })

    describe('Meta data', () => {
        it('Get curve address by index', async () =>{
            let address = await curveRegistryInstance.getCurveAddress(0);
            assert.equal(address, ethers.constants.AddressZero, "Address init incorrectly")

            await assert.notRevert(curveRegistryInstance.from(molAdmin).registerCurve(
                curveIntegralInstance.contract.address,
                "y-axis shift"
            ));

            address = await curveRegistryInstance.getCurveAddress(0);
            assert.equal(address, curveIntegralInstance.contract.address, "Address incorrect")
        });
        it('Get curve data by index', async () => {
            let curveData = await curveRegistryInstance.getCurveData(0);

            assert.equal(curveData[0], ethers.constants.AddressZero, "Index incorrect")
            assert.equal(curveData[1], "", "Invalid function expression")
            assert.equal(curveData[2], false, "Invalid active curve")
            
            await (await curveRegistryInstance.from(molAdmin).registerCurve(
                curveIntegralInstance.contract.address,
                "y-axis shift"
            )).wait();
            
            curveData = await curveRegistryInstance.getCurveData(0);

            assert.equal(curveData[0], curveIntegralInstance.contract.address, "Index incorrect")
            assert.equal(curveData[1], "y-axis shift", "Function expression not updated")
            assert.equal(curveData[2], true, "Invalid inactive curve")
        });
        it('Get index', async () => {
            let index = await curveRegistryInstance.from(molAdmin).getIndex();
            assert.ok(index.eq(0), "Index initialised incorrect");
            
            await( await curveRegistryInstance.from(molAdmin).registerCurve(
                curveIntegralInstance.contract.address,
                "y-axis shift"
            )).wait();

            index = await curveRegistryInstance.from(molAdmin).getIndex();
            assert.ok(index.eq(1), "Index not updated");
        });
        it('Published Block number', async () => {
            const publishedBlock = await curveRegistryInstance.from(molAdmin).publishedBlocknumber();
            assert.ok(publishedBlock.gt(0), "Published block not set")
        });
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
