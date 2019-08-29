


The Molecule Alpha implementation focuses on giving no strings attached funding to small research initiatives. This is done by gamifying the crowdfunding aspect by using bonding curves and a taxation on buy.

Tokens issued via the bonding curve give no rights over the research, and all DAI sent to the bonding curve contract are a donation, with the added benefit that tokens minted for this DAI can be sold along the same curve for potential profit.

The fundraising amount is entirely kept separate, as each buy is taxed and the tax is kept in a vault which can be withdrawn from if the fundraising milestone has been reached.

## How a funding campaign works


- A researcher will fill out project specifics, detailing what the funding milestones are in dollar amounts and what the funds will be used for.
- The Molecule Admin will vet this project proposal, and if approved, the Bonding Curve and Vault contracts will be created.
- Any user can deposit DAI into the bonding curve contract, which will mint bonded tokens along the bonding curve line. A tax will be applied to this transaction, and deducted from the amount of bonded tokens they receive. The taxed amount in DAI is sent to a vault contract.
- Any user with bonded tokens can send bonded tokens to the bonding curve contract, which will be burnt along the bonding curve line, send them DAI in exchange.
- Once the a funding milestone has been reached, the researcher can withdraw this amount into their wallet.

## Curve Parameters


- Our implementation uses the Bancor Formula coded in Vyper, as solidity has some drawbacks when dealing with the curve mathematics.
- Curve Type:
- Taxation Amount:

[Bancor Whitepaper](https://storage.googleapis.com/website-bancor/2018/04/01ba8253-bancor_protocol_whitepaper_en.pdf)

# Implementation


Our initial bonding curve implementation supports linear and Bancor-based curves, dividend distributions for bonded token holders, and a front-running guard via user-specified min and max prices.

### Key Terms

- **bondingCurve**: Contract that holds the curve functionality and token holders amounts of bondedTokens, with automated market maker, tax and distribute functions.
- **vault**: The contract which holds the tax from the bondingCurve. This can be withdrawn by the researcher.
- **moleculeVault**: The contract which holds the tax which is taken off the successfully funded vault. This can be withdrawn by the administrator.
- **bondedToken**: Token native to the curve. The bondingCurve contract has exclusive rights to mint and burn tokens.
- **collateralToken**: Token accepted as collateral by the curve. (e.g. DAI)
- **sellCollateral**: Balance of collateralTokens that the curve holds. The reserve is used to pay bondedToken holders when they want to liquidate and sell their tokens back to the curve.

### Actions

Table to come

## Market Creation


Bonding Curve and Vault contracts can be deployed by the administrator after a project has been vetted by the MarketFactory.

The MarketFactory keeps a record of each Bonding Curve and Vault pair, as well as the admin’s address.

Listed below are the variables stored in each contract:

**MarketFactory:**

 - Bonding Curve & Vault Pair

 - Administrator Address

 - Molecule Vault Address

**Bonding Curve:**

 - Curve Type

 - Taxation Amount

 - Vault Address

**Vault:**

- Milestone Amount & Period Amount Pair

- Researcher Address

## Functions


### ***Bonding Curve Contract***

**priceToMint**: Calculates the price at which to mint bondedTokens given the amount of collateralTokens. A taxed amount is also applied to this, and the taxed collateralTokens are sent to the vault.

    function priceToMint(
     uint256 tokens
    ) public

**rewardForBurn**: Calculates the payout in collateralTokens given the amount of bondedTokens.

    function rewardForBurn(
     uint256 tokens,
    ) public

**distribute**: All sellCollateral within the Bonding Curve contract is distributed between the bondedToken holders. (Exact distribution to come)

    function distribute() public

### *Vault*

**withdraw**: A withdrawal function against the vault. Firstly it checks if the milestone of funding has been reached, and if true, the collateralTokens within the vault are sent to the researcher’s address. Within this interaction, a small tax is sent to the Molecule Vault.

    function withdraw() public

**withdrawAndClose**: Withdraws all the collateralTokens within the Vault and calls distribute() on the Bonding Curve. Both contracts become finalised after this event.

    function withdrawAndClose() public

**killCommand**: Sends all the collateralTokens within the Vault to the Bonding Curve and calls distribute() on the Bonding Curve. Both contracts are finalised after this event.

    function killCommand() public


## Structure

The project is built using our [full-stack boilerplate](https://gitlab.com/linumlabs/ethers-react-redux-typescript-mongo-boilerplate).
This boilerplate provides a framework with the following features:

* Database: MongoDb
* API Server: NestJS
* Web App: React + Redux
 
## System Requirements

* NodeJS >= v10
* Yarn >= 1.0
* MongoDB instance

## Getting Started

The stack is configured as a monorepo. After configuring the various components & environment variables, the project can be spun up from the root.

1.  Clone the repo
2.  Run `yarn` in the project root to install all dependancies

### Starting Application
After configuring the `ApiServer`, `WebApp`, and `Blockchain` following the steps below, run `yarn start:dev` from the root to spin up all the necessary components.

## Configuring `ApiServer`
1. Go to project root
2. Run `cd ApiServer`
3. Run `cp .env.example .env` - this is where you will configure all environment variables
4. Input your MongoDb server details in the `MONGO-HOST=` field (this will be
    localhost if you are running mongo locally or in a docker container with 
    host networking)

## Configuring `WebApp`
1. Go to project root
2. Run `cd WebApp`
3. Make a copy of the `.env.example` file named `.env`
4. Ensure the ApiServer details in the `API_HOST=` field are correct

## Blockchain - Getting started

### Dependencies 

### Deployment

The latest Rinkeby test net deployment as of 27-08-2019:

```
RINKEBY_DAI_ADDRESS=0x9F22cD5824561051dB9AB4652293324f3019B00b
MARKET_REGISTRY_ADDRESS=0x785eA9F1fF715dbE6F4CFb40890F2b33117b65A2
MARKET_FACTORY_ADDRESS=0x7945D145f12f798fA31271F26127f2D3e94AcdA6
```

For testing against the Rinkeby testnet, add the above environment variables to your WebApp `.env` file.

### Running tests

* First install the required packages `yarn install`
* Then initialise the ganache server with `yarn start`
* To run the tests, execute `yarn test`

## Outline of Architecture 

### Overview

The purpose of this architecture is to provide the means of creating, indexing and managing of bonding curve ERC20 markets with advanced integral caculations.

Additionally the lifecycle of the markets is dictated by the means of a vault contract, this contract facilitates the management of funding goals for the compound the market was created for.

In order to facilitate advanced integral math, the `integral` & `inverseIntegral` calculations are written in Vyper, conforming to a Solidty interface.

These function libraries are vetted by our team internally for now, and are added to a curve registry once approved.

### Vault Contract
This Vault contract is a management contract for all the collateral collected in funding the compound, deployed along side the market, this contract assesses the state of each funding round and will dictate whether the compound's managing admin can withdraw funds created during a fund raise.

### Market Contract
This contract is a standard mintable ERC20 contract that utilises bonding curve integral math to calculate the required collateral for minting tokens.
What is unique about this is that the integral math, in order to have complex pricing functions, is done via an external Vyper contract.

Additionally, there is a requirement to calculate the amount of tokens a user could receive for any given amount of collateral tokens, in this case Dai, this is the reason we have an inverse integral function which will be dicussed further in it's overview.

To facilitate funding, the market collects a percentage of incoming collateral to forward to the vault contract when a user executes a minting event.
This could be, as an example, 60% of incoming Dai will be sent to the Vault, with the remaining 40% used to mint tokens into the users account.

### Vyper bonding curve contract
Vyper as a contracting language is pythonic and as such provides a better environment for creation of complex math functions.

These contracts have an `integral` & `inverseIntegral` function which is called by the market to determine the mint & burn values.

### Market Factory
This factory allows a user to deploy a full compound market ecosystem atomically. This factory interfaces with a curve registry to get the address of the specified curve function as well as indexing all deployed markets in a market registry

### Market Registry 
This registry is external to the main market registry, the purpose of extending it out in this way is to allow for new factories to be registered later without risk of losing the history of all deployed markets, additionally the way factories can be registered & unregistered adds a security feature of being able to shut down and publish factories as needed.

### Bonding curve math registry 
This registry allows Molecule and potentially other authorised accounts to register curve contracts that have been audited easily, this allows the market factory to select a curve via configuration rather than addressing. 