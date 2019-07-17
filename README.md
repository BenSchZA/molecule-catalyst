

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
- **collateralToken**: Token accepted as collateral by the curve. (e.g. DAI)
- **sellCollateral**: Balance of collateralTokens that the curve holds. The reserve is used to pay bondedToken holders when they want to liquidate and sell their tokens back to the curve.

### Actions

Table to come


## Market Creation

Bonding Curve and Vault contracts can be deployed by the administrator after a project has been vetted by the MarketFactory. 

The MarketFactory keeps a record of each Bonding Curve and Vault pair, as well as the admin’s address.

Listed below are the variables stored in each contract:

MarketFactory:
- Bonding Curve & Vault Pair
- Administrator Address
- Molecule Vault Address

Bonding Curve:
- Curve Type
- Taxation Amount
- Vault Address

Vault:
- Milestone Amount & Period Amount Pair
- Researcher Address

## Functions

[**`mint`**]: Mints a specific amount of bondedTokens in exchange for collateralTokens.

```
function mint(
 uint256 collateralTokens
) public
```

[**`burn`**]: Burns a specific amount of bondedTokens, and collateralTokens are sent back in the exchange.

```
function burn(
 uint256 bondedTokens
) public
```


[**`priceToMint`**]: Calculates the price at which to mint bondedTokens given the amount of collateralTokens. A taxed amount is also applied to this, and the taxed collateralTokens are sent to the vault.

```
function priceToMint(
 uint256 tokens
) public
```

[**`rewardForBurn`**]: Calculates the payout in collateralTokens given the amount of bondedTokens.

```
function rewardForBurnl(
 uint256 tokens,
) public
```

[**`withdraw`**]: A withdrawal event against the vault. Firstly it checks if the milestone of funding has been reached, and if true, the collateralTokens within the vault are sent to the researcher’s address. Within this interaction, a small tax is sent to the Molecule Vault.

```
function withdraw() public
```

[**`distribute`**]: All sellCollateral within the Bonding Curve contract is distributed between the bondedToken holders. (Exact distribution to come)

```
function distribute() private
```

[**`withdrawAndClose`**]: Withdraws all the collateralTokens within the Vault and calls distribute() on the Bonding Curve. Both contracts are closed after this event.

```
function withdrawAndClose() public
```


[**`killCommand`**]: Sends all the collateralTokens within the Vault to the Bonding Curve and calls distribute() on the Bonding Curve. Both contracts are closed after this event.

```
function killCommand() public
```



