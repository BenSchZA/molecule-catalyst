[CurveRegistry]: #CurveRegistry
[ModifiedWhitelistAdminRole-onlyWhitelistAdmin--]: #ModifiedWhitelistAdminRole-onlyWhitelistAdmin--
[CurveRegistry-numberOfCurves_-uint256]: #CurveRegistry-numberOfCurves_-uint256
[CurveRegistry-publishedBlocknumber_-uint256]: #CurveRegistry-publishedBlocknumber_-uint256
[CurveRegistry-curveContracts_-mapping-uint256----struct-CurveRegistry-CurveOption-]: #CurveRegistry-curveContracts_-mapping-uint256----struct-CurveRegistry-CurveOption-
[CurveRegistry-constructor--]: #CurveRegistry-constructor--
[CurveRegistry-init-address-]: #CurveRegistry-init-address-
[CurveRegistry-registerCurve-address-string-]: #CurveRegistry-registerCurve-address-string-
[CurveRegistry-deactivateCurve-uint256-]: #CurveRegistry-deactivateCurve-uint256-
[CurveRegistry-reactivateCurve-uint256-]: #CurveRegistry-reactivateCurve-uint256-
[CurveRegistry-getCurveAddress-uint256-]: #CurveRegistry-getCurveAddress-uint256-
[CurveRegistry-getCurveData-uint256-]: #CurveRegistry-getCurveData-uint256-
[CurveRegistry-getIndex--]: #CurveRegistry-getIndex--
[CurveRegistry-publishedBlocknumber--]: #CurveRegistry-publishedBlocknumber--
[ModifiedWhitelistAdminRole-isWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-isWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-addWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-addWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-removeWhitelistAdmin--]: #ModifiedWhitelistAdminRole-removeWhitelistAdmin--
[ModifiedWhitelistAdminRole-_addWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-_addWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-_removeWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-_removeWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-WhitelistAdminAdded-address-]: #ModifiedWhitelistAdminRole-WhitelistAdminAdded-address-
[ModifiedWhitelistAdminRole-WhitelistAdminRemoved-address-]: #ModifiedWhitelistAdminRole-WhitelistAdminRemoved-address-
[ICurveRegistry-CurveRegisterd-uint256-address-string-]: #ICurveRegistry-CurveRegisterd-uint256-address-string-
[ICurveRegistry-CurveActivated-uint256-address-]: #ICurveRegistry-CurveActivated-uint256-address-
[ICurveRegistry-CurveDeactivated-uint256-address-]: #ICurveRegistry-CurveDeactivated-uint256-address-
[ICurveRegistry]: #ICurveRegistry
[ICurveRegistry-registerCurve-address-string-]: #ICurveRegistry-registerCurve-address-string-
[ICurveRegistry-deactivateCurve-uint256-]: #ICurveRegistry-deactivateCurve-uint256-
[ICurveRegistry-reactivateCurve-uint256-]: #ICurveRegistry-reactivateCurve-uint256-
[ICurveRegistry-getCurveAddress-uint256-]: #ICurveRegistry-getCurveAddress-uint256-
[ICurveRegistry-getCurveData-uint256-]: #ICurveRegistry-getCurveData-uint256-
[ICurveRegistry-getIndex--]: #ICurveRegistry-getIndex--
[ICurveRegistry-publishedBlocknumber--]: #ICurveRegistry-publishedBlocknumber--
[ICurveRegistry-CurveRegisterd-uint256-address-string-]: #ICurveRegistry-CurveRegisterd-uint256-address-string-
[ICurveRegistry-CurveActivated-uint256-address-]: #ICurveRegistry-CurveActivated-uint256-address-
[ICurveRegistry-CurveDeactivated-uint256-address-]: #ICurveRegistry-CurveDeactivated-uint256-address-
## <span id="CurveRegistry"></span> `CurveRegistry`





- [`onlyWhitelistAdmin()`][ModifiedWhitelistAdminRole-onlyWhitelistAdmin--]
- [`constructor()`][CurveRegistry-constructor--]
- [`init(address _admin)`][CurveRegistry-init-address-]
- [`registerCurve(address _libraryAddress, string _curveFunction)`][CurveRegistry-registerCurve-address-string-]
- [`deactivateCurve(uint256 _index)`][CurveRegistry-deactivateCurve-uint256-]
- [`reactivateCurve(uint256 _index)`][CurveRegistry-reactivateCurve-uint256-]
- [`getCurveAddress(uint256 _index)`][CurveRegistry-getCurveAddress-uint256-]
- [`getCurveData(uint256 _index)`][CurveRegistry-getCurveData-uint256-]
- [`getIndex()`][CurveRegistry-getIndex--]
- [`publishedBlocknumber()`][CurveRegistry-publishedBlocknumber--]
- [`isWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-isWhitelistAdmin-address-]
- [`addWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-addWhitelistAdmin-address-]
- [`removeWhitelistAdmin()`][ModifiedWhitelistAdminRole-removeWhitelistAdmin--]
- [`_addWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-_addWhitelistAdmin-address-]
- [`_removeWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-_removeWhitelistAdmin-address-]
- [`WhitelistAdminAdded(address account)`][ModifiedWhitelistAdminRole-WhitelistAdminAdded-address-]
- [`WhitelistAdminRemoved(address account)`][ModifiedWhitelistAdminRole-WhitelistAdminRemoved-address-]
- [`CurveRegisterd(uint256 index, address libraryAddress, string curveFunction)`][ICurveRegistry-CurveRegisterd-uint256-address-string-]
- [`CurveActivated(uint256 index, address libraryAddress)`][ICurveRegistry-CurveActivated-uint256-address-]
- [`CurveDeactivated(uint256 index, address libraryAddress)`][ICurveRegistry-CurveDeactivated-uint256-address-]

### <span id="CurveRegistry-constructor--"></span> `constructor()` (public)

The deployer of this contract will be the admin.



### <span id="CurveRegistry-init-address-"></span> `init(address _admin)` (public)





### <span id="CurveRegistry-registerCurve-address-string-"></span> `registerCurve(address _libraryAddress, string _curveFunction) → uint256` (external)



   Logs the market into the registery.


### <span id="CurveRegistry-deactivateCurve-uint256-"></span> `deactivateCurve(uint256 _index)` (external)

Allows an dmin to set a curves state to inactive. This function
is for the case of an incorect curve module, or vunrability.




### <span id="CurveRegistry-reactivateCurve-uint256-"></span> `reactivateCurve(uint256 _index)` (external)

Allows an admin to set a curves state to active.




### <span id="CurveRegistry-getCurveAddress-uint256-"></span> `getCurveAddress(uint256 _index) → address` (external)



   Fetches all data and contract addresses of deployed curves by
index, kept as interface for later intergration.


### <span id="CurveRegistry-getCurveData-uint256-"></span> `getCurveData(uint256 _index) → address, string, bool` (external)



   Fetches all data and contract addresses of deployed curves by
index, kept as interface for later intergration.


### <span id="CurveRegistry-getIndex--"></span> `getIndex() → uint256` (external)



   Fetchs the current number of curves infering maximum callable
index.


### <span id="CurveRegistry-publishedBlocknumber--"></span> `publishedBlocknumber() → uint256` (external)



   In order to look up logs efficently, the published block is
available.




## <span id="ICurveRegistry"></span> `ICurveRegistry`





- [`registerCurve(address _libraryAddress, string _curveFunction)`][ICurveRegistry-registerCurve-address-string-]
- [`deactivateCurve(uint256 _index)`][ICurveRegistry-deactivateCurve-uint256-]
- [`reactivateCurve(uint256 _index)`][ICurveRegistry-reactivateCurve-uint256-]
- [`getCurveAddress(uint256 _index)`][ICurveRegistry-getCurveAddress-uint256-]
- [`getCurveData(uint256 _index)`][ICurveRegistry-getCurveData-uint256-]
- [`getIndex()`][ICurveRegistry-getIndex--]
- [`publishedBlocknumber()`][ICurveRegistry-publishedBlocknumber--]
- [`CurveRegisterd(uint256 index, address libraryAddress, string curveFunction)`][ICurveRegistry-CurveRegisterd-uint256-address-string-]
- [`CurveActivated(uint256 index, address libraryAddress)`][ICurveRegistry-CurveActivated-uint256-address-]
- [`CurveDeactivated(uint256 index, address libraryAddress)`][ICurveRegistry-CurveDeactivated-uint256-address-]

### <span id="ICurveRegistry-registerCurve-address-string-"></span> `registerCurve(address _libraryAddress, string _curveFunction) → uint256` (external)



   Logs the market into the registery.


### <span id="ICurveRegistry-deactivateCurve-uint256-"></span> `deactivateCurve(uint256 _index)` (external)

Allows an dmin to set a curves state to inactive. This function
is for the case of an incorect curve module, or vunrability.




### <span id="ICurveRegistry-reactivateCurve-uint256-"></span> `reactivateCurve(uint256 _index)` (external)

Allows an admin to set a curves state to active.




### <span id="ICurveRegistry-getCurveAddress-uint256-"></span> `getCurveAddress(uint256 _index) → address` (external)



   Fetches all data and contract addresses of deployed curves by
index, kept as interface for later intergration.


### <span id="ICurveRegistry-getCurveData-uint256-"></span> `getCurveData(uint256 _index) → address, string, bool` (external)



   Fetches all data and contract addresses of deployed curves by
index, kept as interface for later intergration.


### <span id="ICurveRegistry-getIndex--"></span> `getIndex() → uint256` (external)



   Fetchs the current number of curves infering maximum callable
index.


### <span id="ICurveRegistry-publishedBlocknumber--"></span> `publishedBlocknumber() → uint256` (external)



   In order to look up logs efficently, the published block is
available.


### <span id="ICurveRegistry-CurveRegisterd-uint256-address-string-"></span> `CurveRegisterd(uint256 index, address libraryAddress, string curveFunction)`





### <span id="ICurveRegistry-CurveActivated-uint256-address-"></span> `CurveActivated(uint256 index, address libraryAddress)`





### <span id="ICurveRegistry-CurveDeactivated-uint256-address-"></span> `CurveDeactivated(uint256 index, address libraryAddress)`





