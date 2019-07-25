# Contract interfaces and Events 

# Index
[Registries](#registries)
* [Market Registry](#market-registry )
* [Curve Registry](#curve-registry)

[Market Factory](#market-factory)
[Market](#market)
[Vault](#vault)
[Curve](#curve)
[Molecule Vault](#molecule-vault)

# Registries 

## Market Registry 
##### Add Market Deployer
Adds a new market deployer to the registry
```
function addMarketDeployer(address _newDeployer, string calldata _version) external;
```
emits `DeployerAdded(address deployer, string version);`

---

##### Remove Market Deployer
Removes a market deployer from the registry
```
function removeMarketDeployer(address _deployerToRemove, string calldata _reason) external;
```
emit `DeployerRemoved(address deployer, string reason);`

---

##### Register Market
Logs the market into the registry
```
function registerMarket(
    address _marketAddress,
    address _vault,
    address _creator
)
    external
    returns(uint256);
```
emit `MarketCreated(uint256 index, address indexed marketAddress, address indexed vault, address indexed creator);`

---

##### Get Market
Fetches all data and contract addresses of deployed market by index
```
function getMarket(uint256 _index)
    external
    view
    returns(
        address,
        address,
        address
    );
```

---

##### Get Index
Fetches the length (max) number of markets currently stored
```
function getIndex()
    external
    view
    returns(uint256);
```

---

##### Is Market Deployer
Checks if deployer is registered
```
function isMarketDeployer(address _deployer) external view returns(bool);
```

---

##### Published Blocknumber
For log look up efficiently. The published block number
```
function publishedBlocknumber() external view returns(uint256);
```

## Curve Registry

##### Register Curve
Logs the market into the registry 
```
function registerCurve(
    address _libraryAddress,
    string calldata _curveFunction)
    external
    returns(uint256);
```
emits `CurveRegisterd(uint256 index, address indexed libraryAddress, string curveFunction);`

---

##### Reactivate Curve
Activates curve
```
function reactivateCurve(uint256 _index) external;
```
emit `CurveActivated(uint256 index, address indexed libraryAddress);`

---

##### Deactivate Curve
Deactivates curve, if there is an issue with the curve it can be banned
```
function deactivateCurve(uint256 _index) external;
```
emits `CurveDeactivated(uint256 index, address indexed libraryAddress);`

---

##### Get Curve Address
Returns the address of the curve module 
```
function getCurveAddress(uint256 _index)
    external
    view
    returns(address);
```

---

##### Get Curve Data
Returns all data about the curve at that index
```
function getCurveData(uint256 _index)
    external
    view
    returns(
        address,
        string memory,
        bool
    );
```

---

##### Get Index
Returns the total number of curves
```
function getIndex()
    external
    view
    returns(uint256);
```

---

##### Published Blocknumber
For log look up efficiently. The published block number
```
function publishedBlocknumber() external view returns(uint256);
```

# Market Factory

##### Deploy Market
Deploys a market and then registers it with the market registry. The registry emits an event, but the factory does not emit any event
```
function deployMarket(
    uint256[] calldata _fundingGoals,
    uint256[] calldata _phaseDurations,
    address _creator,
    uint256 _curveType,
    uint256 _taxationRate,
    uint256 _gradientDenominator,
    uint256 _scaledShift
)
    external;
```

---

##### Molecule Vault function
Gets the address of the molecule vault
```
function moleculeVault() external view returns(address);
```

---

##### Market Registry
Gets the address of the market registry
```
function marketRegistry() external view returns(address);
```

---

##### Collateral Token
Gets the address of the collateral token
```
function collateralToken() external view returns(address);
```

---

##### Curve Registry
Gets the address of the curve registry
```
function curveRegistry() public view returns(address);
```

# Market

##### Approve
Approves an address as a spender for the `msg.sender`
```
function approve(address _spender, uint256 _value) external returns (bool);
```
emits `Approval(address indexed owner, address indexed spender, uint256 value);`

---

##### Burn
Sells tokens for collateral
```
function burn(uint256 _numTokens) external returns(bool);
```
<!-- emits `Burn(address indexed from, uint256 amount, uint256 reward);` -->
emits `Transfer(address indexed from, address indexed to, uint value);`

---

##### Mint
Buys tokens for collateral. Note, the `totalCost` emitted includes the tax amount
```
function mint(address _to, uint256 _numTokens) external returns(bool);
```
<!-- emits `Mint(address indexed to, uint256 amount, uint256 totalCost);` -->
emits `Transfer(address indexed from, address indexed to, uint value);`

---

##### Finalize Market
Function ends the market (sets it to inactive) which will halt `mint` and `burn`. Notice this function can only be called by the vault
```
function finaliseMarket() external returns(bool);
```
emit `MarketTerminated();`

---


##### Withdraw
Allows token holders to withdraw their tokens after the `finalization` of the market. Note this function will only work after the market has been finalized
```
function withdraw(uint256 _amount) public returns(bool);
```
emits `Transfer(address indexed from, address indexed to, uint value);`

---

##### Transfer
Transfers `_value` tokens from `msg.sender` to the `_to` address
```
function transfer(address _to, uint256 _value) external returns (bool);
```
emits `Transfer(address indexed from, address indexed to, uint value);`

---

##### Transfer From
Transfers tokens from the `_from` address to the `_to` address. Note that the `msg.sender` must be approved by the `_from` address *before* this function is called or this call will revert
```
function transferFrom(address _from, address _to, uint256 _value) external returns (bool);
```
emits `Transfer(address indexed from, address indexed to, uint value);`

---

##### Price To Mint
Gets the DAI cost for the `_numTokens` to be minted. Notice, this function adds the tax amount to this calculation
```
function priceToMint(uint256 _numTokens) external view returns(uint256);
```

---

##### Reward For Burn
Works out the DAI reward for burning `_numTokens`
```
function rewardForBurn(uint256 _numTokens) external view returns(uint256);
```

---

##### Collateral To Token Buying
Works out the number of tokens you would receive if you spend `_collateralTokenOffered`
```
function collateralToTokenBuying(uint256 _collateralTokenOffered) external view returns(uint256);
```

---

##### Collateral To Token Selling
Works out the number of tokens you would need to sell to receive `_collateralTokenNeeded` amount in collateral
```
function collateralToTokenSelling(uint256 _collateralTokenNeeded) external view returns(uint256);
```

---

##### Allowance
Allows for the checking of spenders allowances
```
function allowance(address _owner, address _spender) external view returns (uint256);
```

---

##### Balance Of
Returns the balance of an address
```
function balanceOf(address _owner) external view returns (uint256);
```

---

##### Total Supply
Returns the number of tokens that are currently in circulation 
```
function totalSupply() external view returns (uint256);
```

---

##### Pool Balance
Returns the total collateral of the market
```
function poolBalance() external view returns (uint256);
```

##### Taxation Rate
The percentage tax paid when purchasing tokens
```
function taxationRate() external view returns(uint256);
```

---

##### decimals
Returns the decimal accuracy of the contract
```
function decimals() external view returns(uint256);
```

---

##### Active
Returns the state of the contract
```
function active() external view returns(bool);
```

# Vault 

##### Initialize
Sets the address of the market. Notice: This function is protected so only an admin can call, and is called from the factory.
```
function initialize(address _market) external returns(bool);
```

---

##### Withdraw
Allows a creator to withdraw a specific rounds funds
```
function withdraw(uint256 _phase) external returns(bool);
```
emits `FundingWithdrawn(uint256 phase, uint256 amount);`

---

##### Validate Funding
 Verifies that the phase passed in: has not been withdrawn, funding goal has been reached, and that the phase has not expired. Notice: Only emits phase finalize once the final phase has been finalized this function can only be called by the market, and is called when someone buys tokens. 
```
function validateFunding() external returns(bool);
```
emits `PhaseFinalised(uint256 phase, uint256 amount);`

---

##### Terminate Market
This function is conditional, if the market has successfully finished (the previous rounds funding's state is `ENDED` and the next phases state is `NOT_STARTED`) then the function sends the Molecule vault it's tax and the creator their remaining collateral. If this condition is not met (the market has failed) then the remaining funds are sent to the market.
Either way the market is finalized.
The event is only emitted if the fundraiser successfully finished
```
function terminateMarket() external;
```
emits `FundingWithdrawn(uint256 phase, uint256 amount);`

---

##### Funding Phase
Returns the funding information for a specific phase.
```
uint256 : fundingThreshold  (in collateral)
uint256 : phaseDuration     (in months)
uint256 : startDate         (block timestamp)
uint8   : state             (emum)

function fundingPhase(uint256 _phase) external view returns(uint256, uint256, uint256, uint8);
```

---

##### Outstanding Withdraw
Returns the amount of funds the creator has not yet withdrawn
```
function outstandingWithdraw() external view returns(uint256);
```

---

##### Current Phase
The current active fundraising round
```
function currentPhase() external view returns(uint256);
```

---

##### Market
Returns the address of the market
```
function market() external view returns(address);
```

---

##### Creator
Returns the address of the creator (funds receiving account)
```
function creator() external view returns(address);
```

---

##### TODO update interface with Whitelistadmin from oppenzepplin along with Roles

```

```

---

##### 

```

```

---

##### 

```

```

---

##### 

```

```

---

# Curve

##### TODO get bens changes before making docs

```
function curveIntegral(uint256 x_t, uint256 gradientDenominator, uint256 b) external pure returns(uint256);
```

---

##### 

```
function inverseCurveIntegral(uint256 x_d, uint256 gradientDenominator, uint256 b) external pure returns(uint256);
```

---

##### 

```

```

# Molecule Vault

##### Transfer

```
function transfer(address _to, uint256 _amount) external;
```

---

##### Approve

```
function approve(address _spender, uint256 _amount) external;
```

---

##### Collateral Token

```
function collateralToken() external view returns(address);
```

---

##### Tax Rate

```
function taxRate() external view returns(uint256);
```

---

##### TODO add admin managed white listed functions

```

```

---

##### 

```

```

---