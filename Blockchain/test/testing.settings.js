const etherlime = require('etherlime-lib');
const ethers = require('ethers');

let MarketAbi = require('../build/Market.json');
let VaultAbi = require('../build/Vault.json');
let PseudoDaiTokenAbi = require('../build/PseudoDaiToken.json');
let MoleculeVaultAbi = require('../build/MoleculeVault.json');
let CurveRegistryAbi = require('../build/CurveRegistry.json');
let MarketRegistryAbi = require('../build/MarketRegistry.json');
let MarketFactoryAbi = require('../build/MarketFactory.json');
let CurveFunctionsAbi = require('../build/CurveFunctions.json');

const defaultDaiPurchase = ethers.utils.parseUnits("5000000", 18);
const defaultTokenVolume = ethers.utils.parseUnits("320000", 18);

const purchasingSequences = {
    first: {
        dai: {
            daiCost: defaultDaiPurchase,
            tokenResult: ethers.utils.parseUnits("317571.0051884025", 18)
        },
        token: {
            daiCost: ethers.utils.parseUnits("5074821.12",18),
            tokenResult: defaultTokenVolume
        }
    },
    second: {
        dai: {
            daiCost: defaultDaiPurchase.mul(2),
            // tokenResult: ethers.utils.parseUnits("360379.8109633054", 18)
        },
        token: {
            daiCost: "",
            tokenResult: defaultTokenVolume.mul(2)
        }
    }
}

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
        ethers.utils.parseUnits("5000000", 18),
        ethers.utils.parseUnits("10000000", 18),
        ethers.utils.parseUnits("15000000", 18)
    ],
    phaseDuration: [
        ethers.utils.parseUnits("12", 0),
        ethers.utils.parseUnits("8", 0),
        ethers.utils.parseUnits("6", 0)
    ],
    curveType: ethers.utils.parseUnits("0", 0),
    taxationRate: ethers.utils.parseUnits("60", 0)
}

const simulatedCurve = {
    scaledShift: ethers.utils.parseUnits("50", 16), // 0.5
    gradientDenominator: ethers.utils.parseUnits("17500", 0),
    defaultPurchaseAmount: ethers.utils.parseUnits("100", 18),
    init:{
        totalSupply: ethers.utils.parseUnits("0", 18),
    },
    purchased: {
        totalSupply: ethers.utils.parseUnits("100", 18),
    }
}

const constants = {
    monthInSeconds: 2629743,
}

module.exports = { 
    ethers,
    etherlime,
    PseudoDaiTokenAbi,
    MarketFactoryAbi,
    MarketAbi,
    MarketRegistryAbi,
    CurveFunctionsAbi,
    CurveRegistryAbi,
    VaultAbi,
    MoleculeVaultAbi,
    marketSettings,
    daiSettings,
    defaultDaiPurchase,
    defaultTokenVolume,
    purchasingSequences,
    moleculeVaultSettings,
    simulatedCurve,
    constants
}