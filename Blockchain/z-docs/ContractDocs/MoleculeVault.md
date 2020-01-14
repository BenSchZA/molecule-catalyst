[IMoleculeVault]: #IMoleculeVault
[IMoleculeVault-addAdmin-address-]: #IMoleculeVault-addAdmin-address-
[IMoleculeVault-transfer-address-uint256-]: #IMoleculeVault-transfer-address-uint256-
[IMoleculeVault-approve-address-uint256-]: #IMoleculeVault-approve-address-uint256-
[IMoleculeVault-updateFeeRate-uint256-]: #IMoleculeVault-updateFeeRate-uint256-
[IMoleculeVault-collateralToken--]: #IMoleculeVault-collateralToken--
[IMoleculeVault-feeRate--]: #IMoleculeVault-feeRate--
[MoleculeVault]: #MoleculeVault
[ModifiedWhitelistAdminRole-onlyWhitelistAdmin--]: #ModifiedWhitelistAdminRole-onlyWhitelistAdmin--
[MoleculeVault-collateralToken_-contract-IERC20]: #MoleculeVault-collateralToken_-contract-IERC20
[MoleculeVault-feeRate_-uint256]: #MoleculeVault-feeRate_-uint256
[MoleculeVault-constructor-address-address-uint256-]: #MoleculeVault-constructor-address-address-uint256-
[MoleculeVault-addAdmin-address-]: #MoleculeVault-addAdmin-address-
[MoleculeVault-transfer-address-uint256-]: #MoleculeVault-transfer-address-uint256-
[MoleculeVault-approve-address-uint256-]: #MoleculeVault-approve-address-uint256-
[MoleculeVault-updateFeeRate-uint256-]: #MoleculeVault-updateFeeRate-uint256-
[MoleculeVault-collateralToken--]: #MoleculeVault-collateralToken--
[MoleculeVault-feeRate--]: #MoleculeVault-feeRate--
[ModifiedWhitelistAdminRole-isWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-isWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-addWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-addWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-removeWhitelistAdmin--]: #ModifiedWhitelistAdminRole-removeWhitelistAdmin--
[ModifiedWhitelistAdminRole-_addWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-_addWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-_removeWhitelistAdmin-address-]: #ModifiedWhitelistAdminRole-_removeWhitelistAdmin-address-
[ModifiedWhitelistAdminRole-WhitelistAdminAdded-address-]: #ModifiedWhitelistAdminRole-WhitelistAdminAdded-address-
[ModifiedWhitelistAdminRole-WhitelistAdminRemoved-address-]: #ModifiedWhitelistAdminRole-WhitelistAdminRemoved-address-
## <span id="IMoleculeVault"></span> `IMoleculeVault`





- [`addAdmin(address _moleculeAdmin)`][IMoleculeVault-addAdmin-address-]
- [`transfer(address _to, uint256 _amount)`][IMoleculeVault-transfer-address-uint256-]
- [`approve(address _spender, uint256 _amount)`][IMoleculeVault-approve-address-uint256-]
- [`updateFeeRate(uint256 _newFeeRate)`][IMoleculeVault-updateFeeRate-uint256-]
- [`collateralToken()`][IMoleculeVault-collateralToken--]
- [`feeRate()`][IMoleculeVault-feeRate--]

### <span id="IMoleculeVault-addAdmin-address-"></span> `addAdmin(address _moleculeAdmin)` (external)

Allows an admin to add another admin.




### <span id="IMoleculeVault-transfer-address-uint256-"></span> `transfer(address _to, uint256 _amount)` (external)

Allows an admin to transfer colalteral out of the molecule
vault and into another address.




### <span id="IMoleculeVault-approve-address-uint256-"></span> `approve(address _spender, uint256 _amount)` (external)

Allows an admin to approve a spender of the molecule vault
collateral.




### <span id="IMoleculeVault-updateFeeRate-uint256-"></span> `updateFeeRate(uint256 _newFeeRate) → bool` (external)

Allows the admin to update the fee rate charged by the
molecule vault.




### <span id="IMoleculeVault-collateralToken--"></span> `collateralToken() → address` (external)





### <span id="IMoleculeVault-feeRate--"></span> `feeRate() → uint256` (external)







## <span id="MoleculeVault"></span> `MoleculeVault`

The vault will send the molecule vault its fee rate when a round of
funding has been successfully filled.



- [`onlyWhitelistAdmin()`][ModifiedWhitelistAdminRole-onlyWhitelistAdmin--]
- [`constructor(address _collateralToken, address _admin, uint256 _feeRate)`][MoleculeVault-constructor-address-address-uint256-]
- [`addAdmin(address _moleculeAdmin)`][MoleculeVault-addAdmin-address-]
- [`transfer(address _to, uint256 _amount)`][MoleculeVault-transfer-address-uint256-]
- [`approve(address _spender, uint256 _amount)`][MoleculeVault-approve-address-uint256-]
- [`updateFeeRate(uint256 _newFeeRate)`][MoleculeVault-updateFeeRate-uint256-]
- [`collateralToken()`][MoleculeVault-collateralToken--]
- [`feeRate()`][MoleculeVault-feeRate--]
- [`isWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-isWhitelistAdmin-address-]
- [`addWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-addWhitelistAdmin-address-]
- [`removeWhitelistAdmin()`][ModifiedWhitelistAdminRole-removeWhitelistAdmin--]
- [`_addWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-_addWhitelistAdmin-address-]
- [`_removeWhitelistAdmin(address account)`][ModifiedWhitelistAdminRole-_removeWhitelistAdmin-address-]
- [`WhitelistAdminAdded(address account)`][ModifiedWhitelistAdminRole-WhitelistAdminAdded-address-]
- [`WhitelistAdminRemoved(address account)`][ModifiedWhitelistAdminRole-WhitelistAdminRemoved-address-]

### <span id="MoleculeVault-constructor-address-address-uint256-"></span> `constructor(address _collateralToken, address _admin, uint256 _feeRate)` (public)

Setts the state variables for the contract.




### <span id="MoleculeVault-addAdmin-address-"></span> `addAdmin(address _moleculeAdmin)` (external)

Allows an admin to add another admin.




### <span id="MoleculeVault-transfer-address-uint256-"></span> `transfer(address _to, uint256 _amount)` (public)

Allows an admin to transfer colalteral out of the molecule
vault and into another address.




### <span id="MoleculeVault-approve-address-uint256-"></span> `approve(address _spender, uint256 _amount)` (public)

Allows an admin to approve a spender of the molecule vault
collateral.




### <span id="MoleculeVault-updateFeeRate-uint256-"></span> `updateFeeRate(uint256 _newFeeRate) → bool` (external)

Allows the admin to update the fee rate charged by the
molecule vault.




### <span id="MoleculeVault-collateralToken--"></span> `collateralToken() → address` (public)





### <span id="MoleculeVault-feeRate--"></span> `feeRate() → uint256` (public)





