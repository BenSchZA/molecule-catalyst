const etherlime = require('etherlime-lib');
const ethers = require('ethers');

let CurveFunctionsAbi = require('../../build/CurveFunctions.json');

describe('Vault test', () => {
    let deployer;
    let molAdmin = accounts[0];
    let userAccount = accounts[1];
    let curveFunctionsInstance;
  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(molAdmin.secretKey);

        curveFunctionsInstance = await deployer.deploy(
            CurveFunctionsAbi,
            false
        );

    });

    describe('Admin functions', async () => {
        it('Registers a curve');
        it('Deactivates a curve');
        it('Activates a curve');
    });

    describe('Meta data', async () =>{
        it('Get curve address by index');
        it('Get curve data by index');
        it('Get index');
        it('Published Block number');

    })
})
