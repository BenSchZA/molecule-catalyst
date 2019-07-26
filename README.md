
# Molecule Alpha Research Funding


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

## Configuring `Blockchain`
### Dependencies 

*  solc@0.5.0
*  etherlime@0.9.18

### Running tests

* First install the required packages with `yarn install`
* (Assuming you have docker installed) Run `yarn start:devnets` which will start the docker container 
* To run the tests, execute `yarn test`

### Etherlime Devnet Deployer

A number of changes have been made to Etherlime, and submitted in a PR, in order to interface with Ganache alternatives. We are using these changes to run our tests as can be seen in the `package.json`: `"etherlime": "BenSchZA/etherlime#temp-feature",`.

A new Etherlime deployer class has been created, with an alternative set of test accounts pre-configured:

* Ganache accounts global variable: `accounts`
* Devnet accounts global variable: `devnetAccounts`

* Ganache deployer: `deployer = await new etherlime.EtherlimeGanacheDeployer(NodeSigner.secretKey);``
* Devnet deployer: `deployer = new etherlime.EtherlimeDevnetDeployer(NodeSigner.secretKey);`

* Ganache `ContractAt`: `basicLinearMarketInstance = await etherlime.ContractAt(BasicLinearMarket, marketAddress[0]);`
* Devnet `ContractAtDevnet`: `basicLinearMarketInstance = await etherlime.ContractAtDevnet(BasicLinearMarket, marketAddress[0]);`

### Deploying contracts to network (local/Rinkeby)

1. Configure environment variables in `.env` file (never commit to repo or expose secrets!) using `.env.example` as an example
2. If deploying to Rinkeby, comment out `RINKEBY_PRIVATE_KEY` variable, and vice-versa
3. Ensure `truffle-config.js` has `development` network details configured, Rinkeby uses Infura RPC by default
4. Run `yarn deploy:local` or `yarn deploy:rinkeby` to deploy contracts

## Contract Deployments

### Nightly

TODO