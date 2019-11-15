
[IMarketFactory]: #IMarketFactory
[IMarketFactory-deployMarket-uint256---uint256---address-uint256-uint256-]: #IMarketFactory-deployMarket-uint256---uint256---address-uint256-uint256-
[IMarketFactory-updateMoleculeVault-address-]: #IMarketFactory-updateMoleculeVault-address-
[IMarketFactory-moleculeVault--]: #IMarketFactory-moleculeVault--
[IMarketFactory-marketRegistry--]: #IMarketFactory-marketRegistry--
[IMarketFactory-curveRegistry--]: #IMarketFactory-curveRegistry--
[IMarketFactory-collateralToken--]: #IMarketFactory-collateralToken--


[MarketFactory]: #MarketFactory
[MarketFactory-onlyAnAdmin--]: #MarketFactory-onlyAnAdmin--
[WhitelistAdminRole-onlyWhitelistAdmin--]: #WhitelistAdminRole-onlyWhitelistAdmin--
[MarketFactory-moleculeVault_-contract-IMoleculeVault]: #MarketFactory-moleculeVault_-contract-IMoleculeVault
[MarketFactory-marketRegistry_-contract-IMarketRegistry]: #MarketFactory-marketRegistry_-contract-IMarketRegistry
[MarketFactory-curveRegistry_-contract-ICurveRegistry]: #MarketFactory-curveRegistry_-contract-ICurveRegistry
[MarketFactory-collateralToken_-contract-IERC20]: #MarketFactory-collateralToken_-contract-IERC20
[MarketFactory-marketCreator_-address]: #MarketFactory-marketCreator_-address
[MarketFactory-isActive_-bool]: #MarketFactory-isActive_-bool
[MarketFactory-constructor-address-address-address-address-]: #MarketFactory-constructor-address-address-address-address-
[MarketFactory-init-address-address-]: #MarketFactory-init-address-address-
[MarketFactory-deployMarket-uint256---uint256---address-uint256-uint256-]: #MarketFactory-deployMarket-uint256---uint256---address-uint256-uint256-
[MarketFactory-updateMoleculeVault-address-]: #MarketFactory-updateMoleculeVault-address-
[MarketFactory-moleculeVault--]: #MarketFactory-moleculeVault--
[MarketFactory-marketRegistry--]: #MarketFactory-marketRegistry--
[MarketFactory-curveRegistry--]: #MarketFactory-curveRegistry--
[MarketFactory-collateralToken--]: #MarketFactory-collateralToken--
[WhitelistAdminRole-isWhitelistAdmin-address-]: #WhitelistAdminRole-isWhitelistAdmin-address-
[WhitelistAdminRole-addWhitelistAdmin-address-]: #WhitelistAdminRole-addWhitelistAdmin-address-
[WhitelistAdminRole-renounceWhitelistAdmin--]: #WhitelistAdminRole-renounceWhitelistAdmin--
[WhitelistAdminRole-_addWhitelistAdmin-address-]: #WhitelistAdminRole-_addWhitelistAdmin-address-
[WhitelistAdminRole-_removeWhitelistAdmin-address-]: #WhitelistAdminRole-_removeWhitelistAdmin-address-
[WhitelistAdminRole-WhitelistAdminAdded-address-]: #WhitelistAdminRole-WhitelistAdminAdded-address-
[WhitelistAdminRole-WhitelistAdminRemoved-address-]: #WhitelistAdminRole-WhitelistAdminRemoved-address-


## <span id="IMarketFactory"></span> `IMarketFactory`


- [`deployMarket(uint256[] _fundingGoals, uint256[] _phaseDurations, address _creator, uint256 _curveType, uint256 _feeRate)`][IMarketFactory-deployMarket-uint256---uint256---address-uint256-uint256-]
- [`updateMoleculeVault(address _newMoleculeVault)`][IMarketFactory-updateMoleculeVault-address-]
- [`moleculeVault()`][IMarketFactory-moleculeVault--]
- [`marketRegistry()`][IMarketFactory-marketRegistry--]
- [`curveRegistry()`][IMarketFactory-curveRegistry--]
- [`collateralToken()`][IMarketFactory-collateralToken--]

### <span id="IMarketFactory-deployMarket-uint256---uint256---address-uint256-uint256-"></span> `deployMarket(uint256[] _fundingGoals, uint256[] _phaseDurations, address _creator, uint256 _curveType, uint256 _feeRate)` (external)

Vyper cannot handle arrays of unknown length,
and thus the funding goals and durations will
only be stored in the vault, which is Solidity.


   This function allows for the creation of a
new market, consisting of a curve and vault


### <span id="IMarketFactory-updateMoleculeVault-address-"></span> `updateMoleculeVault(address _newMoleculeVault)` (external)

This function will only affect new markets, and will not update
already created markets. This can only be called by an admin



### <span id="IMarketFactory-moleculeVault--"></span> `moleculeVault() → address` (external)





### <span id="IMarketFactory-marketRegistry--"></span> `marketRegistry() → address` (external)





### <span id="IMarketFactory-curveRegistry--"></span> `curveRegistry() → address` (external)





### <span id="IMarketFactory-collateralToken--"></span> `collateralToken() → address` (external)



## <span id="MarketFactory"></span> `MarketFactory`

The market factory stores the addresses in the relavant registry.



- [`onlyAnAdmin()`][MarketFactory-onlyAnAdmin--]
- [`onlyWhitelistAdmin()`][WhitelistAdminRole-onlyWhitelistAdmin--]
- [`constructor(address _collateralToken, address _moleculeVault, address _marketRegistry, address _curveRegistry)`][MarketFactory-constructor-address-address-address-address-]
- [`init(address _admin, address _api)`][MarketFactory-init-address-address-]
- [`deployMarket(uint256[] _fundingGoals, uint256[] _phaseDurations, address _creator, uint256 _curveType, uint256 _feeRate)`][MarketFactory-deployMarket-uint256---uint256---address-uint256-uint256-]
- [`updateMoleculeVault(address _newMoleculeVault)`][MarketFactory-updateMoleculeVault-address-]
- [`moleculeVault()`][MarketFactory-moleculeVault--]
- [`marketRegistry()`][MarketFactory-marketRegistry--]
- [`curveRegistry()`][MarketFactory-curveRegistry--]
- [`collateralToken()`][MarketFactory-collateralToken--]
- [`isWhitelistAdmin(address account)`][WhitelistAdminRole-isWhitelistAdmin-address-]
- [`addWhitelistAdmin(address account)`][WhitelistAdminRole-addWhitelistAdmin-address-]
- [`renounceWhitelistAdmin()`][WhitelistAdminRole-renounceWhitelistAdmin--]
- [`_addWhitelistAdmin(address account)`][WhitelistAdminRole-_addWhitelistAdmin-address-]
- [`_removeWhitelistAdmin(address account)`][WhitelistAdminRole-_removeWhitelistAdmin-address-]
- [`WhitelistAdminAdded(address account)`][WhitelistAdminRole-WhitelistAdminAdded-address-]
- [`WhitelistAdminRemoved(address account)`][WhitelistAdminRole-WhitelistAdminRemoved-address-]

### <span id="MarketFactory-onlyAnAdmin--"></span> `onlyAnAdmin()`





### <span id="MarketFactory-constructor-address-address-address-address-"></span> `constructor(address _collateralToken, address _moleculeVault, address _marketRegistry, address _curveRegistry)` (public)



   Sets variables for market deployments.


### <span id="MarketFactory-init-address-address-"></span> `init(address _admin, address _api)` (public)

Inits the market factory




### <span id="MarketFactory-deployMarket-uint256---uint256---address-uint256-uint256-"></span> `deployMarket(uint256[] _fundingGoals, uint256[] _phaseDurations, address _creator, uint256 _curveType, uint256 _feeRate)` (external)

This function allows for the creation of a new market,
consisting of a curve and vault


   Vyper cannot handle arrays of unknown length, and thus the
funding goals and durations will only be stored in the vault,
which is Solidity.


### <span id="MarketFactory-updateMoleculeVault-address-"></span> `updateMoleculeVault(address _newMoleculeVault)` (public)

This function will only affect new markets, and will not update
already created markets. This can only be called by an admin



### <span id="MarketFactory-moleculeVault--"></span> `moleculeVault() → address` (public)





### <span id="MarketFactory-marketRegistry--"></span> `marketRegistry() → address` (public)





### <span id="MarketFactory-curveRegistry--"></span> `curveRegistry() → address` (public)





### <span id="MarketFactory-collateralToken--"></span> `collateralToken() → address` (public)





