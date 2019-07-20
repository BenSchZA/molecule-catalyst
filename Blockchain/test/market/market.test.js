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

describe('Market test', () => {
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

    describe("Pricing functions", () => {
        // TODO: Resolve inverse intergrals variance issue
        it("Calculates Dai to Tokens accurately - Mint")
        // , async () => {
        //     const priceToMintForDai = await marketInstance.colateralToTokenBuying(purchasingSequences.first.dai.daiCost);
        //     assert.ok(priceToMintForDai.eq(purchasingSequences.first.dai.tokenResult), "Price to mint dai incorrect");
        // })
        it("Calculates Dai to Tokens accurately - Burn")
        it("Calculates Token to Dai accurately - Mint", async () => {
            const priceToMintForToken = await marketInstance.priceToMint(purchasingSequences.first.token.tokenResult);
            console.log("Price to mint", ethers.utils.formatUnits(priceToMintForToken, 18))
            assert.ok(priceToMintForToken.eq(purchasingSequences.first.token.daiCost), "Price to mint token incorrect");
        })
        it("Calculates Token to Dai accurately - Burn", async () =>{
            let daiBalance = await pseudoDaiInstance.balanceOf(user1.signer.address);
            const txReceipt = await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();

            const balance = await marketInstance.balanceOf(user1.signer.address);
            const rewardForBurn = await marketInstance.rewardForBurn(balance);
            console.log("price to burn", ethers.utils.formatUnits(rewardForBurn, 18));

            daiBalance = await pseudoDaiInstance.balanceOf(user1.signer.address);
            console.log("Dai Balance after mint", ethers.utils.formatUnits(daiBalance, 18));

            const transfers = (await(txReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.Transfer.topic
            ))).map(transferEvent => marketInstance.interface.parseLog(transferEvent))
            
            assert.ok(daiBalance.sub())
            const purposedBurnValue = transfers[0].values.value.sub(transfers[1].values.value);
            console.log("purposedBurnValue", ethers.utils.formatUnits(purposedBurnValue, 18));
            console.log(ethers.utils.formatUnits(transfers[0].values.value, 18))
            // This will be the vault assert console.log(ethers.utils.formatUnits(transfers[1].values.value, 18))
        })
    })

    describe("Token exchange", () =>{
        it("Mints specified token amount")
        it("Burns specified token amount")
    })

    describe("Vault interactions", () =>{
        it("Only Vault can finalise market")
        it("When finalised, mint/burn unavailable")
        it("When finalised, withdraw functions correctly")
    })

    describe("Events", () => {
        it('Emits Transfer in mint', async () =>{
            let daiBalance = await pseudoDaiInstance.balanceOf(user1.signer.address);
            console.log("Dai Balance before mint", ethers.utils.formatUnits(daiBalance, 18));
            const txReceipt = await (await marketInstance.from(user1).mint(user1.signer.address, purchasingSequences.first.token.tokenResult)).wait();

            
            daiBalance = await pseudoDaiInstance.balanceOf(user1.signer.address);
            const balance = await marketInstance.balanceOf(user1.signer.address);
            console.log("Dai Balance after mint", ethers.utils.formatUnits(daiBalance, 18));
            console.log("Balance after mint", ethers.utils.formatUnits(balance, 18));

            const transfers = (await(txReceipt.events.filter(
                event => event.topics[0] == marketInstance.interface.events.Transfer.topic
            ))).map(transferEvent => marketInstance.interface.parseLog(transferEvent))
            

            // TODO: the value of the second & third event values should equal the first
            console.log(transfers.length)
            const purposedBurnValue = transfers[0].values.value.sub(transfers[1].values.value);
            console.log(ethers.utils.formatUnits(transfers[0].values.value, 18))
            console.log(ethers.utils.formatUnits(transfers[1].values.value, 18))
            console.log(ethers.utils.formatUnits(transfers[2].values.value, 18))
        });
        it('Emits Transfer in burn');
        it('Emits Approve');
        it('Emits MarketTerminated');
    })

    describe('Meta data', () =>{
        
        it('Get taxationRate');
        it('Get active state');

    })

    describe("ERC20 Functions", () => {
        describe("Controls", () => {
            it("Transfers")
            it("Sets allowance")
            it("Transfers from account")
        })
        describe("Meta data", () => {
            it('Get allowance');
            it('Get totalSupply');
            it('Get balanceOf');
            it('Get poolBalance');
            it('Get decimals');
        })
    })
})
