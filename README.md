<div align="center">
    <img src="./Blockchain/x-imgs/mol_cat_logo.png">
    <h3>Molecule Catalyst is an open source crowdfunding platform for medical research and development</h3>
</div>

---


# Index
#### [How a funding campaign works](#how-a-funding-campaign-works)
#### [Implementation](#implementation)
* [Key Terms](#key-terms)
* [Project Life Cycle](#project-life-cycle)
#### [Project Details](#project-details)
* [System Requirements](#system-requirements)
* [Getting Started](#getting-started)
* [Configuring The Repo](#configuring-the-repo)
* [Starting Application](#starting-application)
#### [Contracts Deployment](#contracts-deployment)
* [Rinkeby](#rinkeby)
    * [Staging](#staging)
    * [Nightly](#nightly)
    * [Development](#development)
* [Mainnet](#mainnet)

#### [> To Blockchain `README`](./Blockchain/README.md)

---

# Molecule Catalyst

The Molecule Alpha implementation focuses on giving no strings attached funding to small research initiatives. This is done by gamifying the crowdfunding aspect by using bonding curves and a taxation on buy.

Tokens issued via the bonding curve give no rights over the research, and all DAI sent to the bonding curve contract are a donation, with the added benefit that tokens minted for this DAI can be sold along the same curve for potential profit.

The fundraising amount is entirely kept separate, as each buy is taxed and the tax is kept in a vault which can be withdrawn from if the fundraising milestone has been reached.

---

# How a funding campaign works

- A researcher will fill out project specifics, detailing what the funding milestones are in dollar amounts and what the funds will be used for.
- The Molecule Admin will vet this project proposal, and if approved, the Bonding Curve and Vault contracts will be created.
- Any user can deposit DAI into the bonding curve contract, which will mint bonded tokens along the bonding curve line. A tax will be applied to this transaction, and deducted from the amount of bonded tokens they receive. The taxed amount in DAI is sent to a vault contract.
- Any user with bonded tokens can send bonded tokens to the bonding curve contract, which will be burnt along the bonding curve line, send them DAI in exchange.
- Once the a funding milestone has been reached, the researcher can withdraw this amount into their wallet.

# Implementation

Our initial bonding curve implementation supports linear and Bancor-based curves, dividend distributions for bonded token holders, and a front-running guard via user-specified min and max prices.

## Key Terms

- **bondingCurve**: Contract that holds the curve functionality and token holders amounts of bondedTokens, with automated market maker, tax and distribute functions.
- **vault**: The contract which holds the tax from the bondingCurve. This can be withdrawn by the researcher.
- **moleculeVault**: The contract which holds the tax which is taken off the successfully funded vault. This can be withdrawn by the administrator.
- **bondedToken**: Token native to the curve. The bondingCurve contract has exclusive rights to mint and burn tokens.
- **collateralToken**: Token accepted as collateral by the curve. (e.g. DAI)
- **sellCollateral**: Balance of collateralTokens that the curve holds. The reserve is used to pay bondedToken holders when they want to liquidate and sell their tokens back to the curve.

## Project Life Cycle 

Below is a simplified flow of the contract life cycle. In this section we will go through the life cycle of a project on Molecule Catalyst. 

<div align="center">
    <img src="./Blockchain/x-imgs/molCat_lifecycle.png">
</div>

1. The project life cycle starts outside the contracts with the submission of a project to the Molecule Catalyst team. The team reviews applications to ensure only the higheset quality projects make it onto the system. 
2. If the Molecule Catalyst team approves the project, it then gets entered into the contract architecture. The project and its details are formatted and a transaction (`deployMarket()`) is made with the `MarketFactory`. 
3. The `MarketFactory` will then deploy a `Market` and a `Vault` and link them. The linking of the `Vault` and `Market` allows for communication between the two, and the transferring of funds from the `Market` to the `Vault`, and checks enforced from the `Vault` to the `Market`. 
4. The `MarketFactory` also sends the details of the `Vault` and `Market` to the `MarketRegistry`. This means that `MarketFactory`s can be updated and changed without loosing existing market systems. 
5. Whenever a user buys tokens in the `Market`, a portion of the funding is sent to the `Vault`. The portion is determined by the `_taxationRate`. When the `mint()` function executes in the `Market`, the `validateFunding()` function is called on the `Vault`. This function ensures that the rounds is still valid (has not expired), that the round has not ended and that all the rounds have not been finished. 
6. When a milestone (`_fundingGoal`) has been reached, the project creator will then gain access to that funding. The creator can call the `withdraw()` function on the `Vault` and receive a successful rounds funding. The creator can only withdraw a rounds funding when that rounds funding threshold has been reached.

Anytime throughout the projects life cycle the creator can call the `terminateMarket()` function, and end the fund rasing. This function will not result in them loosing any rounds of funding that where already filled, but it will prevent the market from minting new tokens, and wil cause the market to terminate. The `Market`s termination means that users can no longer buy or sell tokens. They can `withdraw()` funding from the market, exchanging tokens they have for collateral in the market. 

**For more information about this:**

#### [> To Blockchain `README`](./Blockchain/README.md)

**And navigate to Deploying Ecosystem:**
For a detailed look at how the Molecule Catalyst ecosystem is deployed, and the contracts.

# Project Details

The project is built using our [full-stack boilerplate](https://gitlab.com/linumlabs/ethers-react-redux-typescript-mongo-boilerplate).
This boilerplate provides a framework with the following features:

* Database: MongoDb
* API Server: NestJS
* Web App: React + Redux
 
## System Requirements

* NodeJS = 10.6.0
* Yarn >= 1.0
* MongoDB instance

## Getting Started

The stack is configured as a monorepo. After configuring the various components & environment variables, the project can be spun up from the root.

1.  Clone the repo
2.  Run `yarn` in the project root to install all dependencies

### Configuring The Repo

In a terminal: 
1. Go to the Molecule Alpha root project directory
2. Run ```cd ApiServer```
3. Run ```cp .env.example .env``` - this is where you will configure all environment variables
4. Input the various required information from the folders ```.env.example```.
5. Repeate steps 1 through 4 in the `WebApp` folder, and if you want to run the contracts yourself, the `Blockchain` folder.

### Starting Application

After configuring the `ApiServer`, `WebApp`, and `Blockchain` following the steps below, run `yarn start:dev` from the root to spin up all the necessary components.

# Contracts Deployment

A unique database is created for each deployment. For example `MONGO_DATABASE: "molecule-catalyst-$NAMESPACE-$NPM_CONTRACTS_VERSION"`.

## Mainnet

```
DAI_CONTRACT_ADDRESS=0x6b175474e89094c44da98b954eedeac495271d0f
MARKET_REGISTRY_ADDRESS=0x4B63BE91e072665978A3B6f166Ec6bd0C0E6B8be
MARKET_FACTORY_ADDRESS=0xD369704773C61ce6BbFD3EeFC349098021fdD90d
```

## Rinkeby

For testing against the Rinkeby testnet, add the above environment variables to your WebApp `.env` file.

The latest Rinkeby test net deployment as of 28-01-20

```
NPM package: `"@molecule-protocol/catalyst-contracts": "1.0.0"`
```

#### Staging
```
DAI_CONTRACT_ADDRESS=0xF5d2c840E4CB78eDd8b83b55395A341a9F077212
MARKET_REGISTRY_ADDRESS=0xA1878dA3baa3a8705794a2907BdAf43A1dd79889
MARKET_FACTORY_ADDRESS=0x570E9eac2D3756849faEFb6B54342ec8520E6c3E

# Don't include the following, for reference only:
MOLECULE_VAULT_ADDRESS=0x542C5daDdf6CB00CA2E7A0cbd9c7e4bE5a2654ae
CURVE_REGISTRY_ADDRESS=0xe897D4C8601d753Ae0E99427109e3412a8369688

# Admin accounts
ADMIN_PUBLIC_KEY=0xf7089651ccc842812C8A11244cAC0D520d6a645b
BACKEND_DEPLOYER_PUBLIC_KEY=0x4F2e3301E5d9997952Fa92Ecb3974ee3bAd8Fa89
```

#### Nightly
```
DAI_CONTRACT_ADDRESS=0x960d592b084755aEdaEA8634c6Fe4523843D58e0
MARKET_REGISTRY_ADDRESS=0x1177CB6e1fD784d0Bf0701E35514Ab2065dAA463
MARKET_FACTORY_ADDRESS=0x64bFB77eE77007eDe3a341d25e525a5279Eb3869

# Don't include the following, for reference only:
MOLECULE_VAULT_ADDRESS=0xF2Ba85C49E00ca02564224806952246De3be9187
CURVE_REGISTRY_ADDRESS=0x348dA04C71B89F3793975EFa5d2957534AF49F22

# Admin accounts
ADMIN_PUBLIC_KEY=0x708762fC0Ae953eEB23f144cA2Fb0c604ae1Da05 (Gnosis Safe Multisig)
BACKEND_DEPLOYER_PUBLIC_KEY=0x4613e24E3327c393546846444AB28D901b0782B8
```

#### Development
```
DAI_CONTRACT_ADDRESS=0x5c916a958B996E3122165F523d1d1D860418E5c5
MARKET_REGISTRY_ADDRESS=0x6Ae77351872Ff30b449c9E758d39F01d9fddc563
MARKET_FACTORY_ADDRESS=0xd548246BF35803f731a736b433B353BbA36CbeFD

# Don't include the following, for reference only:
MOLECULE_VAULT_ADDRESS=0xD09Ac8b8995e58d5A4396Bcca33ef322d1814B2C
CURVE_REGISTRY_ADDRESS=0x6712dD38B1f502300bE2E1c6ed64E17c7A9005f5
```

**Deployment 24-10-2019:**
```
DAI_CONTRACT_ADDRESS=0xDC3c52266AA4102De49B14c6bD25B495Acb88619
MARKET_REGISTRY_ADDRESS=0xD4D33CE814041F2b777C2726529cdf3F14846B06
MARKET_FACTORY_ADDRESS=0x3D5fbfd16104502104581a44DEe4faE2caDc6595

# Don't include the following, for reference only:
MOLECULE_VAULT_ADDRESS=0x1f1806d9fD7831B57AdB27c6B60d8FF56aBBA6ab
CURVE_REGISTRY_ADDRESS=0x332ac6077da538667547bb2F8eB80E34A2C71575
```

**Deployment 11-09-2019:**
```
DAI_CONTRACT_ADDRESS=0x28668232805cC5faBbf42D59E973b5A8b4c81a67
MARKET_REGISTRY_ADDRESS=0xe9c2Ab8EA767dd6d51cB1Ab2aDCA9b387d7F9D76
MARKET_FACTORY_ADDRESS=0xd43b6F3D244f9a975E5AD032eAF882D169bb5203

# Don't include the following, for reference only:
MOLECULE_VAULT_ADDRESS=0x463c0aF9C940b405813790456c783e40efAFb9b2
CURVE_REGISTRY_ADDRESS=0xFD7eF78bEf868EC515D8C9188d3CAA0c985859C8
```

**Deployment 03-09-2019:**
```
DAI_CONTRACT_ADDRESS=0x231842628F0eC39887EB2Fe95f52C7Fa2DABf56c
MARKET_REGISTRY_ADDRESS=0x3458f1801011732cdd0239d24dF9499fB958817C
MARKET_FACTORY_ADDRESS=0xE6BAB70225B5404D7Fd79218d39b767AbF808875
```

**Deployment 27-08-2019:**
```
DAI_CONTRACT_ADDRESS=0x9F22cD5824561051dB9AB4652293324f3019B00b
MARKET_REGISTRY_ADDRESS=0x785eA9F1fF715dbE6F4CFb40890F2b33117b65A2
MARKET_FACTORY_ADDRESS=0x7945D145f12f798fA31271F26127f2D3e94AcdA6
```

