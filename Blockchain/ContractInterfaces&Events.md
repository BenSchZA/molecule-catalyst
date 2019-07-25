# Contract interfaces and Events 

# Index
[Registries](#registries)
* [Market Registry](#market-registry )
* [Curve Registry](#curve-registry)

[Factories](#factories)
[Market](#market)
[Vault](#vault)
[Curve](#curve)
[Molecule Vault](#molecule-vault)

# Registries 

## Market Registry 
Adds a new market deployer to the registry
```
function addMarketDeployer(address _newDeployer, string calldata _version) external;
```
emits `DeployerAdded(address deployer, string version);`

---

Removes a market deployer from the registry
```
function removeMarketDeployer(address _deployerToRemove, string calldata _reason) external;
```
emit `DeployerRemoved(address deployer, string reason);`

---

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

Fetches the length (max) number of markets currently stored
```
function getIndex()
    external
    view
    returns(uint256);
```

---

Checks if deployer is registered
```
function isMarketDeployer(address _deployer) external view returns(bool);
```

---

For log look up efficiently. The published block number
```
function publishedBlocknumber() external view returns(uint256);
```

## Curve Registry

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

Activates curve
```
function reactivateCurve(uint256 _index) external;
```
emit `CurveActivated(uint256 index, address indexed libraryAddress);`

---

Deactivates curve
```
function deactivateCurve(uint256 _index) external;
```
emits `CurveDeactivated(uint256 index, address indexed libraryAddress);`

---

Returns the address of the curve module 
```
function getCurveAddress(uint256 _index)
    external
    view
    returns(address);
```

---

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

```
function getIndex()
    external
    view
    returns(uint256);
```

---

```
function publishedBlocknumber() external view returns(uint256);
```

# Factories 

```

```

---

```

```

---

```

```

---

```

```

---

```

```

---

# Market

```

```

---

```

```

---

```

```

---

```

```

---

```

```

---

# Vault 

```

```

---

```

```

---

```

```

---

```

```

---

# Curve

```

```

---

```

```

---

```

```

---

```

```

---

```

```

---

# Molecule Vault

```

```

---

```

```

---

```

```

---

```

```

---

```

```

---

```

```

---