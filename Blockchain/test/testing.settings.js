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
const defaultTokenVolume = ethers.utils.parseUnits("250000", 18);

const purchasingSequences = {
    first: {
        dai: {
            daiCost: defaultDaiPurchase,
            tokenResult: ethers.utils.parseUnits("252406.6535262267", 18)
        },
        token: {
            daiCost: ethers.utils.parseUnits("4908085.9375",18),
            tokenResult: defaultTokenVolume
        }
    },
    second: {
        dai: {
            daiCost: defaultDaiPurchase.mul(2),
            tokenResult: ethers.utils.parseUnits("360379.8109633054", 18)
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
    taxationRate: ethers.utils.parseUnits("60", 0),
    scaledShift: ethers.utils.parseUnits("500000000000000000", 0),
    gradientDenominator: ethers.utils.parseUnits("17000", 0),
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
    moleculeVaultSettings
}