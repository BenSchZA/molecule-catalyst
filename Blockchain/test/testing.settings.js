const etherlime = require('etherlime-lib');
const ethers = require('ethers');
const BigNumber = require('bignumber.js');

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

const DECIMALS = 18;
const EXPECTED_PRECISION = DECIMALS - 6;
BigNumber.config({ DECIMAL_PLACES: EXPECTED_PRECISION });
BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_UP });

const purchasingSequences = {
    first: {
        dai: {
            daiCost: defaultDaiPurchase,
            tokenResult: ethers.utils.parseUnits("317571.0051884025", 18)
        },
        token: {
            daiCost: ethers.utils.parseUnits("5074821.12",18),//0x04157b0cf2c3799d500000
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
    taxationRate: ethers.utils.parseUnits("15", 0)
}

let vaultMarketSettings = {
    fundingGoals: [
        ethers.utils.parseUnits("5000000", 18)
    ],
    phaseDuration: [
        ethers.utils.parseUnits("12", 0)
    ],
    curveType: ethers.utils.parseUnits("0", 0),
    taxationRate: ethers.utils.parseUnits("15", 0)
}

const simulatedCurve = {
    scaledShift: ethers.utils.parseUnits("50", 16), // 0.5
    gradientDenominator: ethers.utils.parseUnits("20000", 0),
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
    vaultMarketSettings,
    daiSettings,
    defaultDaiPurchase,
    defaultTokenVolume,
    DECIMALS,
    EXPECTED_PRECISION,
    purchasingSequences,
    moleculeVaultSettings,
    simulatedCurve,
    constants
}
