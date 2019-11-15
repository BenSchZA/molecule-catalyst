<div align="center">
    <img src="x-imgs/mol_cat_logo.png">
    <h3>Molecule Catalyst is an open source crowdfunding platform for medical research and development</h3>
</div>

---

# Index

### [Project Details](#project-details) 
* [Dependencies](#dependencies)
    * [Project scripts](#project-scripts)
### [Smart Contracts](#smart-contracts) 
* [Outline Of Architecture](#outline-of-architecture)
    * [Ecosystem Outline](#ecosystem-outline)
* [Overview Of Individual Contracts](#overview-of-individual-contracts)
    * [Vault Contract](#vault-contract)
    * [Market Contract](#market-contract) 
    * [Market Factory](#market-factory) 
    * [Market Registry](#market-registry) 
    * [Curve Integrals](#curve-integrals) 
    * [Curve Registry](#curve-registry) 
    * [Pseudo Dai (The mocking of Dai for testing purposes)](#pseudo-dai)
* [Detailed Breakdown of Smart Contracts](#detailed-breakdown-of-smart-contracts)
    * [Major functionality breakdown](#major-functionality-breakdown) 
        * [Deploying ecosystem](#deploying-ecosystem) 
        * [Creating a market](#creating-a-market)
        * [Minting market tokens](#minting-market-tokens)
        * [Creator withdrawing](#creator-withdrawing)
        * [Market termination](#market-termination)
    * [Contract Interfaces & Events](./z-docs/ContractInterfaces&Events.md) 
    * [Constructors, Functions & Modifiers](#constructors-functions-modifiers) 
    * [Style Guide](./z-docs/STYLE_GUIDE.md) 
    * [Security Considerations](#security-considerations) 

#### [> To Style Gide](./z-docs/STYLE_GUIDE.md)
#### [> To Contract Interfaces & Events](./z-docs/ContractInterfaces&Events.md)
#### [> To Generated Docs](./z-docs/GeneratedDocsIndex.md)
#### [< Back to main `README`](../README.md)

---

# Project Details

## Dependencies 
This project uses the following tools & libraries. You do not need to manually install these tools as running the scripts in the below section will set them up with the correct versions. 

* `bignumber.js: ^9.0.0`
* `dotenv: 8.0.0`
* `etherlime: 2.2.0`
* `etherlime-lib: 1.1.3`
* `ethers: 4.0.31`
* `openzeppelin-solidity: 2.3.0`
* `solc: 0.5.10`

## Project scripts
For the following example scripts to run, you will need to have `yarn` installed globally. You can use `npm` by replacing `yarn` with `npm run` 
1. First install the required packages by running `yarn`
2. Compile the contracts by running `yarn build`
3. Then, in a separate terminal tab, start the Ganache local blockchain with `yarn start` 
4. To run the tests, execute `yarn test`

To regenerate the docs of the smart contracts, run:
```
npx solidity-docgen --solc-module='/Users/veronicac/Desktop/projects/linumlabs/molecule-alpha/Blockchain/node_modules/solc' --solc-settings "{remappings: ['@openzeppelin=$PWD/node_modules/@openzeppelin']}"
```
Then copy past the output into the respective `x-docs/ContractDocs/` file. Edit the script to the next `contracts/` sub-folder and repeat.

---

# Smart Contracts

Below is the details of the Molecule smart contract ecosystem. 

# Outline Of Architecture

## Ecosystem Outline

The Molecule contract ecosystem has multiple components. The major components are:
* Factories: These create new markets
* Registries: These store the addresses and information about markets 
* Markets: A market consists of a market (ERC20 bonding curve) and a vault (storage of funding and )

## Overview Of Individual Contracts

This section will expand on the meaning and use of each contract within the ecosystem, as well as going through the life cycle of a project within the ecosystem. 

### Vault Contract
This Vault contract is a management contract for all the collateral collected in funding the compound. Deployed along side the market, this contract assesses the state of each funding round and will dictate whether the compound's managing admin can withdraw funds collected.

### Market Contract
This contract is a standard ERC20 contract that utilizes a bonding curve integral math contract (more information below).
The market, through the use of the bonding curve contract, can accommodate both token in, collateral amount out, and collateral amount in, token amount out. 

The collateral for the market is MakerDAO's Dai stable coin. Dai is used for its stable properties, as well as its decentralization (as there is no bank account with dollars owned by a central entity guaranteeing value).

To facilitate funding of the vault, the market removes and redirects a percentage of incoming token minting collateral to the vault contract. This could be, as an example, 60% of incoming Dai will be sent to the Vault, with the remaining 40% used to mint tokens into the users account & collateralizing the market.

### Market Factory
This factory allows a user to deploy a full compound market ecosystem atomically. This factory interfaces with a curve registry to get the address of the specified curve function as well as indexing all deployed markets in the `MarketRegistry`.

### Market Registry 
This registry is external to the `MarketFactory`, the purpose of extending it out in this way is to allow for new factories to be registered later without risk of losing the history of all deployed markets, additionally the way factories can be registered & unregistered adds a security feature of being able to shut down and publish factories as needed.

### Curve Integrals
These contracts have `integral` & `inverseIntegral` functions which are called by the `Market` to determine the `mint()` & `burn()` token and collateral values. These functions allow us to work from tokens to collateral needed, and from collateral to tokens that can be bought for that amount of collateral. This allows us to be accommodating to potential investors. 

### Curve Registry
This registry allows Molecule and potentially other authorized accounts to register curve contracts. This allows the market factory to select a curve library from a range of approved curve integrals. 

# Detailed Breakdown of Smart Contracts

A function level breakdown of the smart contracts and vital functions. 
Further documentation can be found here:

#### [> To Style Gide](./z-docs/STYLE_GUIDE.md)
#### [> To Contract Interfaces & Events](./z-docs/ContractInterfaces&Events.md)
#### [> To Generated Docs](./z-docs/GeneratedDocsIndex.md)

## Major functionality breakdown

Below is a breakdown of each of the major functions within the Molecule ecosystem.

### Deploying ecosystem

Deploying an ecosystem refers specifically to the entire Molecule contract ecosystem rather than an individual project. The ecosystem consists of factories (deployer) and registries (persistent storage between possible upgrades). 

<div align="center">
    <img src="x-imgs/deploying_mol_ecosystem.png">
</div>

The ecosystem is deployed by a deployer wallet. The deployer address is assumed to be insecure, and as such is removed/replaced as an admin on the major contracts.

The pattern is such:
The major contract is deployed, the deployer address is automatically added as an admin by the `WhitelistAdmin` contract. The deployer does any registering or secondary functionality that it needs to do, and then the `init()` function is called, adding the admin as an admin and removing the deployer as an admin.

**Validation**
There is no validation on the ecosystem deployment, as there is no pre-existing data to check against in a new instance of the system. 

### Creating a market 

A market consists of a `Market` and a `Vault`. Each market has a set number of funding rounds as well as a set time limit for each round.

<div align="center">
    <img src="x-imgs/deploying_market_ecosystem.png">
</div>

Only a user who is a `WhitelistAdmin` on the Market Factory can deploy a market system, with the exception of the API, which has been specially added to the `MarketFactory`, and can not do any admin functionality on the `MarketFactory` besides deploying a market. This was done for easy of use, and while it may open the system up to attack, the damage is limited by the scope of permissions given to the API. 

**Validation**
When creating a market, the following things are validated (within the `marketFactory`):
* The `_fundingGoals` and `_phaseDurations` must have the same number of elements in the array. 
* The `_creator` address cannot be a `0x` address.
* The `_curveType` is used against the `curveRegistry` to get the address of the `curveLibrary`. The received `curveLibrary` address is checked for validity (not 0 address). It is also checked for its active state.
* The `_taxationRate` is checked, ensuring that the rate is between (excluding) 0-100.

The following things are validated within the `Vault`:
* The `_fundingGoals` and `_phaseDurations` have matching lengths.
* The `_fundingGoals` length is not smaller than 0 or larger than 10.

The market does no validation.

### Minting market tokens

The tokens conform to the standard ERC20 model, with the added functionality of a `withdraw()` for once the market has been terminated. For more information about the market termination process, please see [this](#market-contract-cfm).

<div align="center">
    <img src="x-imgs/minting_market_tokens.png">
</div>

Any address can mint project tokens.

**Validation**
The following is validated within the `Market`:
* The price for the number of tokens is bigger than 0
* Requires that all `.transfer()`s pass
* Requires the `validateFunding()` call on the vault passes

The `Vault` within the `validateFunding()` function, checks:
* That the current phase has started (this checks it is not the phase after the last phase, as that phase is never set to started)
* That the current phase has not expired (run over its pre-set end date)
* If there is an funding that pushes the vault over the `_fundingThreshold` then it will roll that funding over into the next funding round 
* If that funding roll over will next the next round (or any round after that) the rounds are looped through and ended. 

### Creator withdrawing 

The `Vault` allows for the creator to withdraw any successfully completed funding rounds. If multiple rounds have been completed, calling the `withdraw()` function will withdraw all outstanding completed rounds funding.

<div align="center">
    <img src="x-imgs/creator_withdrawing_funding_round.png">
</div>

The `withdraw()` function can only be called by a `WhitelistAdmin` of the `Vault`.

**Validation**
The `Vault` validates that:
* The caller is a `WhitelistAdmin`
* The `Vault` `isActive` (has been initialized (connected to its `Market`))
* There is funding for the researcher to withdraw (`outstandingWithdraw_`)
* Skips over any funding rounds that have already been paid out
* Requires the funding gets sent to the creator
* Checks if the current round is the last round, if it and the market is still active and the creator has withdrawn all funding, the market will be terminated.

### Market termination

The market can be terminated in multiple situations. There are 3 such situations.
1. The market admin(a `WhitelistAdmin` on the `Vault`) calls the `terminateMarket()` function.
2. The market admin(a `WhitelistAdmin` on the `Vault`) withdraws the remaining funding from the `Vault` after all rounds have ended. The `Vault` will then automatically checking the market is still active, and if it is terminate it.
3. The minting of tokens called the `validateFunding()` function in the `Vault`. If the current round has expired (exceeded its pre-set time limit) the market will then terminate.

<div align="center">
    <img src="x-imgs/market_terminate_options.png">
</div>

**Validation**

## Contract Interfaces & Events

The document that covers the Contract Interfaces & Events was omitted from this document to maintain a reasonable length. It can be found [here](./z-docs/ContractInterfaces&Events.md).

## Constructors, Functions & Modifiers

Please see the generated docs in the following locations:
* [`IVault` & `Vault`](./z-docs/ContractDocs/Vault.md)
* [`IMarket` & `Market`](./z-docs/ContractDocs/Market.md)
* [`IMarketFactory` & `MarketFactory`](./z-docs/ContractDocs/MarketFactory.md)
* [`MarketRegistry`](./z-docs/ContractDocs/MarketRegistry.md)
* [`CurveFunctions`](./z-docs/ContractDocs/curveFunctions.md)
* [`CurveRegistry`](./z-docs/ContractDocs/curveRegistry.md)
* [`MoleculeVault`](./z-docs/ContractDocs/MoleculeVault.md)

## Security Considerations

<h4>High Potential Impact (solved)</h4>

**Deployer private key has a considerable likelihood to get compromised**
The deployer script needs a private key in order to deploy the contract ecosystem. When the contracts are deployed the `msg.sender` of the contract creation transaction is added as a `WhitelistAdmin` to the major spokes within the architecture. As the `WhitelistAdmin` has upgrade-ability rights on these spokes it is of high priority and importance that there is no unintended access to this level of control over the ecosystem.
**Fix**
The deployer, during the course of the deployment, adds a multi-sig wallet as the admin of the core contracts, and then removes itself as admin when it no longer needs to interact with the core contract again.

<h4>Potential Impact (avoided)</h4>

**Market Factory: API private key has a considerable likelihood to get compromised**
The API needs to have the rights to deploy a market from the market factory.
**Handling**
Instead of adding the API private key as a prior mentioned `WhitelistAdmin`, the API private key is added with a specific role, (`marketCreator_`). This address is only allowed to deploy a market ecosystem (`Vault` & `Market`), and can be updated by the `WhitelistAdmin`.


