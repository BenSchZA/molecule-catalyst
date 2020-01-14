[IMarketRegistry]: #IMarketRegistry
[IMarketRegistry-addMarketDeployer-address-string-]: #IMarketRegistry-addMarketDeployer-address-string-
[IMarketRegistry-removeMarketDeployer-address-string-]: #IMarketRegistry-removeMarketDeployer-address-string-
[IMarketRegistry-registerMarket-address-address-address-]: #IMarketRegistry-registerMarket-address-address-address-
[IMarketRegistry-getMarket-uint256-]: #IMarketRegistry-getMarket-uint256-
[IMarketRegistry-getIndex--]: #IMarketRegistry-getIndex--
[IMarketRegistry-isMarketDeployer-address-]: #IMarketRegistry-isMarketDeployer-address-
[IMarketRegistry-publishedBlocknumber--]: #IMarketRegistry-publishedBlocknumber--
[IMarketRegistry-MarketCreated-uint256-address-address-address-]: #IMarketRegistry-MarketCreated-uint256-address-address-address-
[IMarketRegistry-DeployerAdded-address-string-]: #IMarketRegistry-DeployerAdded-address-string-
[IMarketRegistry-DeployerRemoved-address-string-]: #IMarketRegistry-DeployerRemoved-address-string-
[MarketRegistry]: #MarketRegistry
[MarketRegistry-isRegisteredDeployer--]: #MarketRegistry-isRegisteredDeployer--
[ModifiedWhitelistAdminRole-onlyWhitelistAdmin--]: #ModifiedWhitelistAdminRole-onlyWhitelistAdmin--
[MarketRegistry-numberOfMarkets_-uint256]: #MarketRegistry-numberOfMarkets_-uint256
[MarketRegistry-publishedBlocknumber_-uint256]: #MarketRegistry-publishedBlocknumber_-uint256
[MarketRegistry-markets_-mapping-uint256----struct-MarketRegistry-Market-]: #MarketRegistry-markets_-mapping-uint256----struct-MarketRegistry-Market-
[MarketRegistry-deployer_-mapping-address----bool-]: #MarketRegistry-deployer_-mapping-address----bool-
[MarketRegistry-constructor--]: #MarketRegistry-constructor--
[MarketRegistry-init-address-]: #MarketRegistry-init-address-
[MarketRegistry-addMarketDeployer-address-string-]: #MarketRegistry-addMarketDeployer-address-string-
[MarketRegistry-removeMarketDeployer-address-string-]: #MarketRegistry-removeMarketDeployer-address-string-
[MarketRegistry-registerMarket-address-address-address-]: #MarketRegistry-registerMarket-address-address-address-
[MarketRegistry-getMarket-uint256-]: #MarketRegistry-getMarket-uint256-
[MarketRegistry-getIndex--]: #MarketRegistry-getIndex--
[MarketRegistry-isMarketDeployer-address-]: #MarketRegistry-isMarketDeployer-address-
[MarketRegistry-publishedBlocknumber--]: #MarketRegistry-publishedBlocknumber--
[ModifiedWhitelistAdminRole-isWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-isWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-addWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-addWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-removeWhitelistAdmin--]: #ModifiedWhitelistAdminRole-removeWhitelistAdmin--
[ModifiedWhitelistAdminRole-_addWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-_addWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-_removeWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-_removeWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-WhitelistAdminAdded-address-]: #ModifiedWhitelistAdminRole-WhitelistAdminAdded-address-
[ModifiedWhitelistAdminRole-WhitelistAdminRemoved-address-]: #ModifiedWhitelistAdminRole-WhitelistAdminRemoved-address-
[IMarketRegistry-MarketCreated-uint256-address-address-address-]: #IMarketRegistry-MarketCreated-uint256-address-address-address-
[IMarketRegistry-DeployerAdded-address-string-]: #IMarketRegistry-DeployerAdded-address-string-
[IMarketRegistry-DeployerRemoved-address-string-]: #IMarketRegistry-DeployerRemoved-address-string-
## <span id="IMarketRegistry"></span> `IMarketRegistry`





- [`addMarketDeployer(address _newDeployer, string _version)`][IMarketRegistry-addMarketDeployer-address-string-]
- [`removeMarketDeployer(address _deployerToRemove, string _reason)`][IMarketRegistry-removeMarketDeployer-address-string-]
- [`registerMarket(address _marketAddress, address _vault, address _creator)`][IMarketRegistry-registerMarket-address-address-address-]
- [`getMarket(uint256 _index)`][IMarketRegistry-getMarket-uint256-]
- [`getIndex()`][IMarketRegistry-getIndex--]
- [`isMarketDeployer(address _deployer)`][IMarketRegistry-isMarketDeployer-address-]
- [`publishedBlocknumber()`][IMarketRegistry-publishedBlocknumber--]
- [`MarketCreated(uint256 index, address marketAddress, address vault, address creator)`][IMarketRegistry-MarketCreated-uint256-address-address-address-]
- [`DeployerAdded(address deployer, string version)`][IMarketRegistry-DeployerAdded-address-string-]
- [`DeployerRemoved(address deployer, string reason)`][IMarketRegistry-DeployerRemoved-address-string-]

### <span id="IMarketRegistry-addMarketDeployer-address-string-"></span> `addMarketDeployer(address _newDeployer, string _version)` (external)



   Adds a new market deployer to the registry.


### <span id="IMarketRegistry-removeMarketDeployer-address-string-"></span> `removeMarketDeployer(address _deployerToRemove, string _reason)` (external)



   Removes a market deployer from the registry.


### <span id="IMarketRegistry-registerMarket-address-address-address-"></span> `registerMarket(address _marketAddress, address _vault, address _creator) → uint256` (external)



   Logs the market into the registery.


### <span id="IMarketRegistry-getMarket-uint256-"></span> `getMarket(uint256 _index) → address, address, address` (external)



   Fetches all data and contract addresses of deployed
markets by index, kept as interface for later
intergration.


### <span id="IMarketRegistry-getIndex--"></span> `getIndex() → uint256` (external)

@dev	Fetchs the current number of markets infering maximum
callable index.
@return	uint256: The number of markets that have been deployed.



### <span id="IMarketRegistry-isMarketDeployer-address-"></span> `isMarketDeployer(address _deployer) → bool` (external)

@dev	Used to check if the deployer is registered.




### <span id="IMarketRegistry-publishedBlocknumber--"></span> `publishedBlocknumber() → uint256` (external)

@dev	In order to look up logs efficently, the published block is
available.
@return	uint256: The block when the contract was published.



### <span id="IMarketRegistry-MarketCreated-uint256-address-address-address-"></span> `MarketCreated(uint256 index, address marketAddress, address vault, address creator)`





### <span id="IMarketRegistry-DeployerAdded-address-string-"></span> `DeployerAdded(address deployer, string version)`





### <span id="IMarketRegistry-DeployerRemoved-address-string-"></span> `DeployerRemoved(address deployer, string reason)`







## <span id="MarketRegistry"></span> `MarketRegistry`





- [`isRegisteredDeployer()`][MarketRegistry-isRegisteredDeployer--]
- [`onlyWhitelistAdmin()`][ModifiedWhitelistAdminRole-onlyWhitelistAdmin--]
- [`constructor()`][MarketRegistry-constructor--]
- [`init(address _admin)`][MarketRegistry-init-address-]
- [`addMarketDeployer(address _newDeployer, string _version)`][MarketRegistry-addMarketDeployer-address-string-]
- [`removeMarketDeployer(address _deployerToRemove, string _reason)`][MarketRegistry-removeMarketDeployer-address-string-]
- [`registerMarket(address _marketAddress, address _vault, address _creator)`][MarketRegistry-registerMarket-address-address-address-]
- [`getMarket(uint256 _index)`][MarketRegistry-getMarket-uint256-]
- [`getIndex()`][MarketRegistry-getIndex--]
- [`isMarketDeployer(address _deployer)`][MarketRegistry-isMarketDeployer-address-]
- [`publishedBlocknumber()`][MarketRegistry-publishedBlocknumber--]
- [`isWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-isWhitelistAdmin-address-]
- [`addWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-addWhitelistAdmin-address-]
- [`removeWhitelistAdmin()`][ModifiedWhitelistAdminRole-removeWhitelistAdmin--]
- [`_addWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-_addWhitelistAdmin-address-]
- [`_removeWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-_removeWhitelistAdmin-address-]
- [`WhitelistAdminAdded(address account)`][ModifiedWhitelistAdminRole-WhitelistAdminAdded-address-]
- [`WhitelistAdminRemoved(address account)`][ModifiedWhitelistAdminRole-WhitelistAdminRemoved-address-]
- [`MarketCreated(uint256 index, address marketAddress, address vault, address creator)`][IMarketRegistry-MarketCreated-uint256-address-address-address-]
- [`DeployerAdded(address deployer, string version)`][IMarketRegistry-DeployerAdded-address-string-]
- [`DeployerRemoved(address deployer, string reason)`][IMarketRegistry-DeployerRemoved-address-string-]

### <span id="MarketRegistry-isRegisteredDeployer--"></span> `isRegisteredDeployer()`





### <span id="MarketRegistry-constructor--"></span> `constructor()` (public)

The deployer of this contract will be the admin.



### <span id="MarketRegistry-init-address-"></span> `init(address _admin)` (public)





### <span id="MarketRegistry-addMarketDeployer-address-string-"></span> `addMarketDeployer(address _newDeployer, string _version)` (external)



   Adds a new market deployer to the registry.


### <span id="MarketRegistry-removeMarketDeployer-address-string-"></span> `removeMarketDeployer(address _deployerToRemove, string _reason)` (external)



   Removes a market deployer from the registry.


### <span id="MarketRegistry-registerMarket-address-address-address-"></span> `registerMarket(address _marketAddress, address _vault, address _creator) → uint256` (external)



   Logs the market into the registery.


### <span id="MarketRegistry-getMarket-uint256-"></span> `getMarket(uint256 _index) → address, address, address` (external)



   Fetches all data and contract addresses of deployed
markets by index, kept as interface for later
intergration.


### <span id="MarketRegistry-getIndex--"></span> `getIndex() → uint256` (external)

@dev	Fetchs the current number of markets infering maximum
callable index.
@return	uint256: The number of markets that have been deployed.



### <span id="MarketRegistry-isMarketDeployer-address-"></span> `isMarketDeployer(address _deployer) → bool` (external)

@dev	Used to check if the deployer is registered.




### <span id="MarketRegistry-publishedBlocknumber--"></span> `publishedBlocknumber() → uint256` (external)

@dev	In order to look up logs efficently, the published block is
available.
@return	uint256: The block when the contract was published.



