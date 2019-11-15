[IVault]: #IVault
[IVault-initialize-address-]: #IVault-initialize-address-
[IVault-withdraw--]: #IVault-withdraw--
[IVault-validateFunding-uint256-]: #IVault-validateFunding-uint256-
[IVault-terminateMarket--]: #IVault-terminateMarket--
[IVault-fundingPhase-uint256-]: #IVault-fundingPhase-uint256-
[IVault-outstandingWithdraw--]: #IVault-outstandingWithdraw--
[IVault-currentPhase--]: #IVault-currentPhase--
[IVault-getTotalRounds--]: #IVault-getTotalRounds--
[IVault-market--]: #IVault-market--
[IVault-creator--]: #IVault-creator--
[IVault-FundingWithdrawn-uint256-uint256-]: #IVault-FundingWithdrawn-uint256-uint256-
[IVault-PhaseFinalised-uint256-uint256-]: #IVault-PhaseFinalised-uint256-uint256-
[Vault]: #Vault
[Vault-onlyMarket--]: #Vault-onlyMarket--
[Vault-isActive--]: #Vault-isActive--
[WhitelistAdminRole-onlyWhitelistAdmin--]: #WhitelistAdminRole-onlyWhitelistAdmin--
[Vault-creator_-address]: #Vault-creator_-address
[Vault-market_-contract-IMarket]: #Vault-market_-contract-IMarket
[Vault-collateralToken_-contract-IERC20]: #Vault-collateralToken_-contract-IERC20
[Vault-moleculeVault_-contract-IMoleculeVault]: #Vault-moleculeVault_-contract-IMoleculeVault
[Vault-moleculeFeeRate_-uint256]: #Vault-moleculeFeeRate_-uint256
[Vault-currentPhase_-uint256]: #Vault-currentPhase_-uint256
[Vault-outstandingWithdraw_-uint256]: #Vault-outstandingWithdraw_-uint256
[Vault-totalRounds_-uint256]: #Vault-totalRounds_-uint256
[Vault-cumulativeReceivedFee_-uint256]: #Vault-cumulativeReceivedFee_-uint256
[Vault-_active-bool]: #Vault-_active-bool
[Vault-fundingPhases_-mapping-uint256----struct-Vault-FundPhase-]: #Vault-fundingPhases_-mapping-uint256----struct-Vault-FundPhase-
[Vault-constructor-uint256---uint256---address-address-address-]: #Vault-constructor-uint256---uint256---address-address-address-
[Vault-initialize-address-]: #Vault-initialize-address-
[Vault-withdraw--]: #Vault-withdraw--
[Vault-validateFunding-uint256-]: #Vault-validateFunding-uint256-
[Vault-terminateMarket--]: #Vault-terminateMarket--
[Vault-fundingPhase-uint256-]: #Vault-fundingPhase-uint256-
[Vault-outstandingWithdraw--]: #Vault-outstandingWithdraw--
[Vault-currentPhase--]: #Vault-currentPhase--
[Vault-getTotalRounds--]: #Vault-getTotalRounds--
[Vault-market--]: #Vault-market--
[Vault-creator--]: #Vault-creator--
[Vault-_endCurrentRound--]: #Vault-_endCurrentRound--
[WhitelistAdminRole-isWhitelistAdmin-address-]: #WhitelistAdminRole-isWhitelistAdmin-address-
[WhitelistAdminRole-addWhitelistAdmin-address-]: #WhitelistAdminRole-addWhitelistAdmin-address-
[WhitelistAdminRole-renounceWhitelistAdmin--]: #WhitelistAdminRole-renounceWhitelistAdmin--
[WhitelistAdminRole-_addWhitelistAdmin-address-]: #WhitelistAdminRole-_addWhitelistAdmin-address-
[WhitelistAdminRole-_removeWhitelistAdmin-address-]: #WhitelistAdminRole-_removeWhitelistAdmin-address-
[WhitelistAdminRole-WhitelistAdminAdded-address-]: #WhitelistAdminRole-WhitelistAdminAdded-address-
[WhitelistAdminRole-WhitelistAdminRemoved-address-]: #WhitelistAdminRole-WhitelistAdminRemoved-address-
[IVault-FundingWithdrawn-uint256-uint256-]: #IVault-FundingWithdrawn-uint256-uint256-
[IVault-PhaseFinalised-uint256-uint256-]: #IVault-PhaseFinalised-uint256-uint256-
## <span id="IVault"></span> `IVault`

The vault stores the tax from the market until the funding goal is
reached, thereafter the creator may withdraw the funds. If the
funding is not reached within the stipulated time-frame, or the
creator terminates the market, the funding is sent back to the
market to be re-distributed.


   The vault pulls the mol tax directly from the molecule vault.

- [`initialize(address _market)`][IVault-initialize-address-]
- [`withdraw()`][IVault-withdraw--]
- [`validateFunding(uint256 _receivedFunding)`][IVault-validateFunding-uint256-]
- [`terminateMarket()`][IVault-terminateMarket--]
- [`fundingPhase(uint256 _phase)`][IVault-fundingPhase-uint256-]
- [`outstandingWithdraw()`][IVault-outstandingWithdraw--]
- [`currentPhase()`][IVault-currentPhase--]
- [`getTotalRounds()`][IVault-getTotalRounds--]
- [`market()`][IVault-market--]
- [`creator()`][IVault-creator--]
- [`FundingWithdrawn(uint256 phase, uint256 amount)`][IVault-FundingWithdrawn-uint256-uint256-]
- [`PhaseFinalised(uint256 phase, uint256 amount)`][IVault-PhaseFinalised-uint256-uint256-]

### <span id="IVault-initialize-address-"></span> `initialize(address _market) → bool` (external)



   Initialized the contract, sets up owners and gets the market
address. This function exists becuase the Vault does not have
an address untill the constructor has funished running. The
cumulative funding threshold is set here becuse of gas issues
within the constructor.


### <span id="IVault-withdraw--"></span> `withdraw() → bool` (external)

@notice	ALlows the creator to withdraw the various phases as they are
compleated.




### <span id="IVault-validateFunding-uint256-"></span> `validateFunding(uint256 _receivedFunding) → bool` (external)

@notice	Verifies that the phase passed in: has not been withdrawn,
funding goal has been reached, and that the phase has not
expired. Adds fee amount to the vault pool.




### <span id="IVault-terminateMarket--"></span> `terminateMarket()` (external)

If this function is called before the end of all phases, all
unclaimed (outstanding) funding will be sent to the market to be
redistributed.

   This function sends the vaults funds to the market, and sets the
outstanding withdraw to 0.


### <span id="IVault-fundingPhase-uint256-"></span> `fundingPhase(uint256 _phase) → uint256, uint256, uint256, uint256, enum IVault.FundingState` (external)

Returns all the details (relavant to external code) for a
specific phase.




### <span id="IVault-outstandingWithdraw--"></span> `outstandingWithdraw() → uint256` (external)

@return	uint256: The amount of funding that the creator has earned by
not withdrawn.



### <span id="IVault-currentPhase--"></span> `currentPhase() → uint256` (external)



   The current active phase of funding


### <span id="IVault-getTotalRounds--"></span> `getTotalRounds() → uint256` (external)





### <span id="IVault-market--"></span> `market() → address` (external)

@return	address: The address of the market that is funding this vault.



### <span id="IVault-creator--"></span> `creator() → address` (external)

@return	address: The address of the creator of this project.



### <span id="IVault-FundingWithdrawn-uint256-uint256-"></span> `FundingWithdrawn(uint256 phase, uint256 amount)`





### <span id="IVault-PhaseFinalised-uint256-uint256-"></span> `PhaseFinalised(uint256 phase, uint256 amount)`







## <span id="Vault"></span> `Vault`

The vault stores the fee from the market until the funding goal is
reached, thereafter the creator may withdraw the funds. If the
funding is not reached within the stipulated time-frame, or the
creator terminates the market, the funding is sent back to the
market to be re-distributed.


   The vault pulls the mol fee directly from the molecule vault.

- [`onlyMarket()`][Vault-onlyMarket--]
- [`isActive()`][Vault-isActive--]
- [`onlyWhitelistAdmin()`][WhitelistAdminRole-onlyWhitelistAdmin--]
- [`constructor(uint256[] _fundingGoals, uint256[] _phaseDurations, address _creator, address _collateralToken, address _moleculeVault)`][Vault-constructor-uint256---uint256---address-address-address-]
- [`initialize(address _market)`][Vault-initialize-address-]
- [`withdraw()`][Vault-withdraw--]
- [`validateFunding(uint256 _receivedFunding)`][Vault-validateFunding-uint256-]
- [`terminateMarket()`][Vault-terminateMarket--]
- [`fundingPhase(uint256 _phase)`][Vault-fundingPhase-uint256-]
- [`outstandingWithdraw()`][Vault-outstandingWithdraw--]
- [`currentPhase()`][Vault-currentPhase--]
- [`getTotalRounds()`][Vault-getTotalRounds--]
- [`market()`][Vault-market--]
- [`creator()`][Vault-creator--]
- [`_endCurrentRound()`][Vault-_endCurrentRound--]
- [`isWhitelistAdmin(address account)`][WhitelistAdminRole-isWhitelistAdmin-address-]
- [`addWhitelistAdmin(address account)`][WhitelistAdminRole-addWhitelistAdmin-address-]
- [`renounceWhitelistAdmin()`][WhitelistAdminRole-renounceWhitelistAdmin--]
- [`_addWhitelistAdmin(address account)`][WhitelistAdminRole-_addWhitelistAdmin-address-]
- [`_removeWhitelistAdmin(address account)`][WhitelistAdminRole-_removeWhitelistAdmin-address-]
- [`WhitelistAdminAdded(address account)`][WhitelistAdminRole-WhitelistAdminAdded-address-]
- [`WhitelistAdminRemoved(address account)`][WhitelistAdminRole-WhitelistAdminRemoved-address-]
- [`FundingWithdrawn(uint256 phase, uint256 amount)`][IVault-FundingWithdrawn-uint256-uint256-]
- [`PhaseFinalised(uint256 phase, uint256 amount)`][IVault-PhaseFinalised-uint256-uint256-]

### <span id="Vault-onlyMarket--"></span> `onlyMarket()`

Ensures that only the market may call the function.



### <span id="Vault-isActive--"></span> `isActive()`

Ensures that the vault gets initialized before use.



### <span id="Vault-constructor-uint256---uint256---address-address-address-"></span> `constructor(uint256[] _fundingGoals, uint256[] _phaseDurations, address _creator, address _collateralToken, address _moleculeVault)` (public)



   Checks the range of funding rounds (1-9). Gets the Molecule fee
from the molecule vault directly.


### <span id="Vault-initialize-address-"></span> `initialize(address _market) → bool` (external)



   Initialized the contract, sets up owners and gets the market
address. This function exists becuase the Vault does not have
an address untill the constructor has funished running. The
cumulative funding threshold is set here becuse of gas issues
within the constructor.


### <span id="Vault-withdraw--"></span> `withdraw() → bool` (external)

Allows the creator to withdraw a round of funding.


   The withdraw function should be called after each funding round
has been sucessfully filled. If the withdraw is called after the
last round has ended, the market will terminate and any
remaining funds will be sent to the market.


### <span id="Vault-validateFunding-uint256-"></span> `validateFunding(uint256 _receivedFunding) → bool` (external)

Allows the market to check that the funding


   This function will terminate the market if the time for the
round is exceeded. This will loose any funding the creator has
not withdrawn.


### <span id="Vault-terminateMarket--"></span> `terminateMarket()` (public)

If this function is called before the end of all phases, all
unclaimed (outstanding) funding will be sent to the market to be
redistributed.

   This function sends the vaults funds to the market, and sets the
outstanding withdraw to 0.


### <span id="Vault-fundingPhase-uint256-"></span> `fundingPhase(uint256 _phase) → uint256, uint256, uint256, uint256, enum IVault.FundingState` (public)

Returns all the details (relavant to external code) for a
specific phase.




### <span id="Vault-outstandingWithdraw--"></span> `outstandingWithdraw() → uint256` (public)

@return	uint256: The amount of funding that the creator has earned by
not withdrawn.



### <span id="Vault-currentPhase--"></span> `currentPhase() → uint256` (public)



   The current active phase of funding


### <span id="Vault-getTotalRounds--"></span> `getTotalRounds() → uint256` (public)





### <span id="Vault-market--"></span> `market() → address` (public)

@return	address: The address of the market that is funding this vault.



### <span id="Vault-creator--"></span> `creator() → address` (external)

@return	address: The address of the creator of this project.



### <span id="Vault-_endCurrentRound--"></span> `_endCurrentRound()` (internal)



   Ends the round, increments to the next round, rollsover excess
funding, sets the start date of the next round, if there is one.

