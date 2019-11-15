[IMarket]: #IMarket
[IMarket-approve-address-uint256-]: #IMarket-approve-address-uint256-
[IMarket-burn-uint256-]: #IMarket-burn-uint256-
[IMarket-mint-address-uint256-]: #IMarket-mint-address-uint256-
[IMarket-transfer-address-uint256-]: #IMarket-transfer-address-uint256-
[IMarket-transferFrom-address-address-uint256-]: #IMarket-transferFrom-address-address-uint256-
[IMarket-finaliseMarket--]: #IMarket-finaliseMarket--
[IMarket-withdraw-uint256-]: #IMarket-withdraw-uint256-
[IMarket-priceToMint-uint256-]: #IMarket-priceToMint-uint256-
[IMarket-rewardForBurn-uint256-]: #IMarket-rewardForBurn-uint256-
[IMarket-collateralToTokenBuying-uint256-]: #IMarket-collateralToTokenBuying-uint256-
[IMarket-collateralToTokenSelling-uint256-]: #IMarket-collateralToTokenSelling-uint256-
[IMarket-allowance-address-address-]: #IMarket-allowance-address-address-
[IMarket-balanceOf-address-]: #IMarket-balanceOf-address-
[IMarket-poolBalance--]: #IMarket-poolBalance--
[IMarket-totalSupply--]: #IMarket-totalSupply--
[IMarket-feeRate--]: #IMarket-feeRate--
[IMarket-decimals--]: #IMarket-decimals--
[IMarket-active--]: #IMarket-active--
[IMarket-Approval-address-address-uint256-]: #IMarket-Approval-address-address-uint256-
[IMarket-Transfer-address-address-uint256-]: #IMarket-Transfer-address-address-uint256-
[IMarket-Mint-address-uint256-uint256-uint256-]: #IMarket-Mint-address-uint256-uint256-uint256-
[IMarket-Burn-address-uint256-uint256-]: #IMarket-Burn-address-uint256-uint256-
[IMarket-MarketTerminated--]: #IMarket-MarketTerminated--

[Market]: #Market
[Market-onlyActive--]: #Market-onlyActive--
[Market-onlyVault--]: #Market-onlyVault--
[Market-active_-bool]: #Market-active_-bool
[Market-creatorVault_-contract-IVault]: #Market-creatorVault_-contract-IVault
[Market-feeRate_-uint256]: #Market-feeRate_-uint256
[Market-curveLibrary_-contract-ICurveFunctions]: #Market-curveLibrary_-contract-ICurveFunctions
[Market-collateralToken_-contract-IERC20]: #Market-collateralToken_-contract-IERC20
[Market-totalSupply_-uint256]: #Market-totalSupply_-uint256
[Market-decimals_-uint256]: #Market-decimals_-uint256
[Market-allowed-mapping-address----mapping-address----uint256--]: #Market-allowed-mapping-address----mapping-address----uint256--
[Market-balances-mapping-address----uint256-]: #Market-balances-mapping-address----uint256-
[Market-constructor-uint256-address-address-address-]: #Market-constructor-uint256-address-address-address-
[Market-burn-uint256-]: #Market-burn-uint256-
[Market-mint-address-uint256-]: #Market-mint-address-uint256-
[Market-collateralToTokenBuying-uint256-]: #Market-collateralToTokenBuying-uint256-
[Market-collateralToTokenSelling-uint256-]: #Market-collateralToTokenSelling-uint256-
[Market-poolBalance--]: #Market-poolBalance--
[Market-feeRate--]: #Market-feeRate--
[Market-decimals--]: #Market-decimals--
[Market-active--]: #Market-active--
[Market-finaliseMarket--]: #Market-finaliseMarket--
[Market-withdraw-uint256-]: #Market-withdraw-uint256-
[Market-priceToMint-uint256-]: #Market-priceToMint-uint256-
[Market-rewardForBurn-uint256-]: #Market-rewardForBurn-uint256-
[Market-_curveIntegral-uint256-]: #Market-_curveIntegral-uint256-
[Market-_inverseCurveIntegral-uint256-]: #Market-_inverseCurveIntegral-uint256-
[Market-totalSupply--]: #Market-totalSupply--
[Market-balanceOf-address-]: #Market-balanceOf-address-
[Market-allowance-address-address-]: #Market-allowance-address-address-
[Market-approve-address-uint256-]: #Market-approve-address-uint256-
[Market-transferFrom-address-address-uint256-]: #Market-transferFrom-address-address-uint256-
[Market-transfer-address-uint256-]: #Market-transfer-address-uint256-
[IERC20-Transfer-address-address-uint256-]: #IERC20-Transfer-address-address-uint256-
[IERC20-Approval-address-address-uint256-]: #IERC20-Approval-address-address-uint256-
[IMarket-Mint-address-uint256-uint256-uint256-]: #IMarket-Mint-address-uint256-uint256-uint256-
[IMarket-Burn-address-uint256-uint256-]: #IMarket-Burn-address-uint256-uint256-
[IMarket-MarketTerminated--]: #IMarket-MarketTerminated--


## <span id="IMarket"></span> `IMarket`


- [`approve(address _spender, uint256 _value)`][IMarket-approve-address-uint256-]
- [`burn(uint256 _numTokens)`][IMarket-burn-uint256-]
- [`mint(address _to, uint256 _numTokens)`][IMarket-mint-address-uint256-]
- [`transfer(address _to, uint256 _value)`][IMarket-transfer-address-uint256-]
- [`transferFrom(address _from, address _to, uint256 _value)`][IMarket-transferFrom-address-address-uint256-]
- [`finaliseMarket()`][IMarket-finaliseMarket--]
- [`withdraw(uint256 _amount)`][IMarket-withdraw-uint256-]
- [`priceToMint(uint256 _numTokens)`][IMarket-priceToMint-uint256-]
- [`rewardForBurn(uint256 _numTokens)`][IMarket-rewardForBurn-uint256-]
- [`collateralToTokenBuying(uint256 _collateralTokenOffered)`][IMarket-collateralToTokenBuying-uint256-]
- [`collateralToTokenSelling(uint256 _collateralTokenNeeded)`][IMarket-collateralToTokenSelling-uint256-]
- [`allowance(address _owner, address _spender)`][IMarket-allowance-address-address-]
- [`balanceOf(address _owner)`][IMarket-balanceOf-address-]
- [`poolBalance()`][IMarket-poolBalance--]
- [`totalSupply()`][IMarket-totalSupply--]
- [`feeRate()`][IMarket-feeRate--]
- [`decimals()`][IMarket-decimals--]
- [`active()`][IMarket-active--]
- [`Approval(address owner, address spender, uint256 value)`][IMarket-Approval-address-address-uint256-]
- [`Transfer(address from, address to, uint256 value)`][IMarket-Transfer-address-address-uint256-]
- [`Mint(address to, uint256 amountMinted, uint256 collateralAmount, uint256 researchContribution)`][IMarket-Mint-address-uint256-uint256-uint256-]
- [`Burn(address from, uint256 amountBurnt, uint256 collateralReturned)`][IMarket-Burn-address-uint256-uint256-]
- [`MarketTerminated()`][IMarket-MarketTerminated--]

### <span id="IMarket-approve-address-uint256-"></span> `approve(address _spender, uint256 _value) → bool` (external)

Approves transfers for a given address.




### <span id="IMarket-burn-uint256-"></span> `burn(uint256 _numTokens) → bool` (external)



   Selling tokens back to the bonding curve for collateral.


### <span id="IMarket-mint-address-uint256-"></span> `mint(address _to, uint256 _numTokens) → bool` (external)

@dev	We have modified the minting function to divert a portion of the
collateral for the purchased tokens to the vault.




### <span id="IMarket-transfer-address-uint256-"></span> `transfer(address _to, uint256 _value) → bool` (external)

Transfer ownership token from msg.sender to a specified address.




### <span id="IMarket-transferFrom-address-address-uint256-"></span> `transferFrom(address _from, address _to, uint256 _value) → bool` (external)

Transfer tokens from one address to another.




### <span id="IMarket-finaliseMarket--"></span> `finaliseMarket() → bool` (external)

@notice	Can only be called by this markets vault


   Allows the market to end once all funds have been raised.
Ends the market so that no more tokens can be bought or sold.
Tokens can still be transfered, or "withdrawn" for an enven
distribution of remaining collateral.

### <span id="IMarket-withdraw-uint256-"></span> `withdraw(uint256 _amount) → bool` (external)



   Allows token holders to withdraw collateral in return for tokens
after the market has been finalised.


### <span id="IMarket-priceToMint-uint256-"></span> `priceToMint(uint256 _numTokens) → uint256` (external)

@dev	Returns the required collateral amount for a volume of bonding
curve tokens
@param	_numTokens: The number of tokens to calculate the price of




### <span id="IMarket-rewardForBurn-uint256-"></span> `rewardForBurn(uint256 _numTokens) → uint256` (external)

@dev	Returns the required collateral amount for a volume of bonding
curve tokens
@param	_numTokens: The number of tokens to work out the collateral
vaule of




### <span id="IMarket-collateralToTokenBuying-uint256-"></span> `collateralToTokenBuying(uint256 _collateralTokenOffered) → uint256` (external)

This function returns the amount of tokens one can receive for a
specified amount of collateral token. Including molecule &
market contributions




### <span id="IMarket-collateralToTokenSelling-uint256-"></span> `collateralToTokenSelling(uint256 _collateralTokenNeeded) → uint256` (external)

This function returns the amount of tokens needed to be burnt to
withdraw a specified amount of reserve token.




### <span id="IMarket-allowance-address-address-"></span> `allowance(address _owner, address _spender) → uint256` (external)

Gets the value of the current allowance specifed for that
account.




### <span id="IMarket-balanceOf-address-"></span> `balanceOf(address _owner) → uint256` (external)

Gets the balance of the specified address.




### <span id="IMarket-poolBalance--"></span> `poolBalance() → uint256` (external)

Total collateral backing the curve.




### <span id="IMarket-totalSupply--"></span> `totalSupply() → uint256` (external)

Total number of tokens in existence




### <span id="IMarket-feeRate--"></span> `feeRate() → uint256` (external)



	The rate of fee (%) the market pays towards the vault on token
purchases.

### <span id="IMarket-decimals--"></span> `decimals() → uint256` (external)

@return	uint256: The decimals set for the market



### <span id="IMarket-active--"></span> `active() → bool` (external)

@return	bool: The active stat of the market. Inactive markets have
ended.



### <span id="IMarket-Approval-address-address-uint256-"></span> `Approval(address owner, address spender, uint256 value)`





### <span id="IMarket-Transfer-address-address-uint256-"></span> `Transfer(address from, address to, uint256 value)`





### <span id="IMarket-Mint-address-uint256-uint256-uint256-"></span> `Mint(address to, uint256 amountMinted, uint256 collateralAmount, uint256 researchContribution)`





### <span id="IMarket-Burn-address-uint256-uint256-"></span> `Burn(address from, uint256 amountBurnt, uint256 collateralReturned)`





### <span id="IMarket-MarketTerminated--"></span> `MarketTerminated()`



## <span id="Market"></span> `Market`

The market will send a portion of all collateral on mint to the
vault to fill the funding rounds.


   Checks with vault on every mint to ensure rounds are still active,
goal has not been met, and that the round has not expired.

- [`onlyActive()`][Market-onlyActive--]
- [`onlyVault()`][Market-onlyVault--]
- [`constructor(uint256 _feeRate, address _creatorVault, address _curveLibrary, address _collateralToken)`][Market-constructor-uint256-address-address-address-]
- [`burn(uint256 _numTokens)`][Market-burn-uint256-]
- [`mint(address _to, uint256 _numTokens)`][Market-mint-address-uint256-]
- [`collateralToTokenBuying(uint256 _collateralTokenOffered)`][Market-collateralToTokenBuying-uint256-]
- [`collateralToTokenSelling(uint256 _collateralTokenNeeded)`][Market-collateralToTokenSelling-uint256-]
- [`poolBalance()`][Market-poolBalance--]
- [`feeRate()`][Market-feeRate--]
- [`decimals()`][Market-decimals--]
- [`active()`][Market-active--]
- [`finaliseMarket()`][Market-finaliseMarket--]
- [`withdraw(uint256 _amount)`][Market-withdraw-uint256-]
- [`priceToMint(uint256 _numTokens)`][Market-priceToMint-uint256-]
- [`rewardForBurn(uint256 _numTokens)`][Market-rewardForBurn-uint256-]
- [`_curveIntegral(uint256 _x)`][Market-_curveIntegral-uint256-]
- [`_inverseCurveIntegral(uint256 _x)`][Market-_inverseCurveIntegral-uint256-]
- [`totalSupply()`][Market-totalSupply--]
- [`balanceOf(address _owner)`][Market-balanceOf-address-]
- [`allowance(address _owner, address _spender)`][Market-allowance-address-address-]
- [`approve(address _spender, uint256 _value)`][Market-approve-address-uint256-]
- [`transferFrom(address _from, address _to, uint256 _value)`][Market-transferFrom-address-address-uint256-]
- [`transfer(address _to, uint256 _value)`][Market-transfer-address-uint256-]
- [`Transfer(address from, address to, uint256 value)`][IERC20-Transfer-address-address-uint256-]
- [`Approval(address owner, address spender, uint256 value)`][IERC20-Approval-address-address-uint256-]
- [`Mint(address to, uint256 amountMinted, uint256 collateralAmount, uint256 researchContribution)`][IMarket-Mint-address-uint256-uint256-uint256-]
- [`Burn(address from, uint256 amountBurnt, uint256 collateralReturned)`][IMarket-Burn-address-uint256-uint256-]
- [`MarketTerminated()`][IMarket-MarketTerminated--]

### <span id="Market-onlyActive--"></span> `onlyActive()`

Ensures the market's key functionality is only available when
the market is active.



### <span id="Market-onlyVault--"></span> `onlyVault()`

Enaures a function is only callable by the vault.



### <span id="Market-constructor-uint256-address-address-address-"></span> `constructor(uint256 _feeRate, address _creatorVault, address _curveLibrary, address _collateralToken)` (public)

@notice	Sets the needed variables for the market




### <span id="Market-burn-uint256-"></span> `burn(uint256 _numTokens) → bool` (external)



   Selling tokens back to the bonding curve for collateral.


### <span id="Market-mint-address-uint256-"></span> `mint(address _to, uint256 _numTokens) → bool` (external)

@dev	We have modified the minting function to divert a portion of the
collateral for the purchased tokens to the vault.




### <span id="Market-collateralToTokenBuying-uint256-"></span> `collateralToTokenBuying(uint256 _collateralTokenOffered) → uint256` (external)

This function returns the amount of tokens one can receive for a
specified amount of collateral token.




### <span id="Market-collateralToTokenSelling-uint256-"></span> `collateralToTokenSelling(uint256 _collateralTokenNeeded) → uint256` (external)

This function returns the amount of tokens needed to be burnt to
withdraw a specified amount of reserve token.




### <span id="Market-poolBalance--"></span> `poolBalance() → uint256` (external)

Total collateral backing the curve.




### <span id="Market-feeRate--"></span> `feeRate() → uint256` (external)



	The rate of fee the market pays towards the vault on token
purchases.

### <span id="Market-decimals--"></span> `decimals() → uint256` (external)

@return	uint256 : The decimals set for the market



### <span id="Market-active--"></span> `active() → bool` (external)

@return	bool : The active stat of the market. Inactive markets have
ended.



### <span id="Market-finaliseMarket--"></span> `finaliseMarket() → bool` (public)

@notice	Can only be called by this markets vault


   Allows the market to end once all funds have been raised.
Ends the market so that no more tokens can be bought or sold.
Tokens can still be transfered, or "withdrawn" for an enven
distribution of remaining collateral.

### <span id="Market-withdraw-uint256-"></span> `withdraw(uint256 _amount) → bool` (public)



   Allows token holders to withdraw collateral in return for tokens
after the market has been finalised.


### <span id="Market-priceToMint-uint256-"></span> `priceToMint(uint256 _numTokens) → uint256` (public)

@dev	Returns the required collateral amount for a volume of bonding
curve tokens
@param	_numTokens: The number of tokens to calculate the price of




### <span id="Market-rewardForBurn-uint256-"></span> `rewardForBurn(uint256 _numTokens) → uint256` (public)

@dev	Returns the required collateral amount for a volume of bonding
curve tokens
@param	_numTokens: The number of tokens to work out the collateral
vaule of




### <span id="Market-_curveIntegral-uint256-"></span> `_curveIntegral(uint256 _x) → uint256` (internal)



   Calculate the integral from 0 to x tokens supply. Calls the
curve integral function on the math library.


### <span id="Market-_inverseCurveIntegral-uint256-"></span> `_inverseCurveIntegral(uint256 _x) → uint256` (internal)



   Inverse integral to convert the incoming colateral value to
token volume.


### <span id="Market-totalSupply--"></span> `totalSupply() → uint256` (external)

Total number of tokens in existence




### <span id="Market-balanceOf-address-"></span> `balanceOf(address _owner) → uint256` (external)

Gets the balance of the specified address.




### <span id="Market-allowance-address-address-"></span> `allowance(address _owner, address _spender) → uint256` (external)

Gets the value of the current allowance specifed for that
account.




### <span id="Market-approve-address-uint256-"></span> `approve(address _spender, uint256 _value) → bool` (external)

Approves transfers for a given address.




### <span id="Market-transferFrom-address-address-uint256-"></span> `transferFrom(address _from, address _to, uint256 _value) → bool` (public)

Transfer tokens from one address to another.




### <span id="Market-transfer-address-uint256-"></span> `transfer(address _to, uint256 _value) → bool` (public)

Transfer ownership token from msg.sender to a specified address.
