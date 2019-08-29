## Getting started

### Dependencies 

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