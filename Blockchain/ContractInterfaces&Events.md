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

##### Molecule Vault
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

```
function allowance(address _owner, address _spender) external view returns (uint256);
```

---

##### 

```
function balanceOf(address _owner) external view returns (uint256);
```

---

##### 

```
function totalSupply() external view returns (uint256);
```

---

##### 

```
function poolBalance() external view returns (uint256);
```

---

##### 

```
function moleculeVault() external view returns(address);
```

---

##### 

```
function contributionRate() external view returns(uint256);
```

---

##### 

```
function decimals() external view returns(uint256);
```

---

##### 

```
function active() external view returns(bool);
```

# Vault 

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

##### 

```

```

---

# Curve

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

##### 

```

```

---

##### 

```

```

---

# Molecule Vault

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