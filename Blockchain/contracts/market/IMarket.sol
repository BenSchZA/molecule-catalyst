pragma solidity 0.5.10;

/**
  * @author @veronicaLC (Veronica Coutts) & @RyRy79261 (Ryan Nobel)
  * @title Market
  */
interface IMarket {
	// Emitted when a spender is approved
    event Approval(
      address indexed owner,
      address indexed spender,
      uint256 value
    );
    // Emitted when a transfer, mint or burn occurs
    event Transfer(address indexed from, address indexed to, uint value);
    // Emitted when tokens are minted
    event Mint(
      address indexed to,			// The address reciving the tokens
      uint256 amountMinted,			// The amount of tokens minted
      uint256 collateralAmount,		// The amount of DAI spent
      uint256 researchContribution	// The tax donatedd (in DAI)
    );
    // Emitted when tokens are burnt
    event Burn(
      address indexed from,			// The address burning the tokens
      uint256 amountBurnt,			// The amount of tokens burnt
      uint256 collateralReturned	//  DAI being recived (in DAI)
    );
	// Emitted when the market is terminated
    event MarketTerminated();

    /**
      * @notice Approves transfers for a given address.
      * @param  _spender : The account that will receive the funds.
      * @param  _value : The value of funds accessed.
      * @return boolean : Indicating the action was successful.
      */
    function approve(address _spender, uint256 _value) external returns (bool);

     /**
      * @dev    Selling tokens back to the bonding curve for collateral.
      * @param  _numTokens: The number of tokens that you want to burn.
      */
    function burn(uint256 _numTokens) external returns(bool);

    /**
      * @dev	We have modified the minting function to divert a portion of the
      *         collateral for the purchased tokens to the vault.
      * @param  _to : Address to mint tokens to.
      * @param  _numTokens : The number of tokens you want to mint.
      */
    function mint(address _to, uint256 _numTokens) external returns(bool);

    /**
      * @notice Transfer ownership token from msg.sender to a specified address.
      * @param  _to : The address to transfer to.
      * @param  _value : The amount to be transferred.
      */
    function transfer(address _to, uint256 _value) external returns (bool);

    /**
      * @notice Transfer tokens from one address to another.
      * @param  _from: The address which you want to send tokens from.
      * @param  _to: The address which you want to transfer to.
      * @param  _value: The amount of tokens to be transferred.
      */
    function transferFrom(
		address _from,
		address _to,
		uint256 _value
	)
		external
		returns(bool);

    /**
	  * @notice	Can only be called by this markets vault
      * @dev    Allows the market to end once all funds have been raised.
      *         Ends the market so that no more tokens can be bought or sold.
	  *			Tokens can still be transfered, or "withdrawn" for an enven
	  *			distribution of remaining collateral.
      */
    function finaliseMarket() external returns(bool);

    /**
      * @dev    Allows token holders to withdraw collateral in return for tokens
      * 		after the market has been finalised.
      * @param 	_amount: The amount of tokens they want to withdraw
      */
    function withdraw(uint256 _amount) external returns(bool);

    /**
	  * @dev	Returns the required collateral amount for a volume of bonding
	  *			curve tokens
	  * @param	_numTokens: The number of tokens to calculate the price of
      * @return uint256 : The required collateral amount for a volume of bonding
      *         curve tokens.
      */
    function priceToMint(uint256 _numTokens) external view returns(uint256);

    /**
	  * @dev	Returns the required collateral amount for a volume of bonding
	  *			curve tokens
	  * @param	_numTokens: The number of tokens to work out the collateral
	  *			vaule of
      * @return uint256: The required collateral amount for a volume of bonding
      *         curve tokens
      */
    function rewardForBurn(uint256 _numTokens) external view returns(uint256);

    /**
      * @notice This function returns the amount of tokens one can receive for a
      *         specified amount of collateral token. Including molecule &
	  *			market contributions
      * @param  _collateralTokenOffered: Amount of reserve token offered for
      *         purchase
      * @return uint256: The amount of tokens one can purchase with the
      *         specified collateral
      */
    function collateralToTokenBuying(
		uint256 _collateralTokenOffered
	)
		external
		view
		returns(uint256);

    /**
      * @notice This function returns the amount of tokens needed to be burnt to
      *         withdraw a specified amount of reserve token.
      * @param  _collateralTokenNeeded: Amount of dai to be withdraw.
	  * @return	uint256: The amount of tokens needed to burn to reach goal
	  *			colalteral
      */
    function collateralToTokenSelling(
		uint256 _collateralTokenNeeded
	)
		external
		view
		returns(uint256);

    /**
      * @notice Gets the value of the current allowance specifed for that
      *         account.
      * @param  _owner: The account sending the funds.
      * @param  _spender: The account that will receive the funds.
	  * @return	uint256: representing the amount the spender can spend
      */
    function allowance(
		address _owner,
		address _spender
	)
		external
		view
		returns(uint256);

    /**
      * @notice Gets the balance of the specified address.
      * @param  _owner: The address to query the the balance of.
      * @return  uint256: Represents the amount owned by the passed address.
      */
    function balanceOf(address _owner) external view returns (uint256);

    /**
      * @notice Total collateral backing the curve.
      * @return uint256: Represents the total collateral backing the curve.
      */
    function poolBalance() external view returns (uint256);

    /**
      * @notice Total number of tokens in existence
      * @return uint256: Represents the total supply of tokens in this market.
      */
    function totalSupply() external view returns (uint256);

    /**
      * @dev 	The rate of fee (%) the market pays towards the vault on token
	    *			  purchases.
      */
    function feeRate() external view returns(uint256);

    /**
      * @return	uint256: The decimals set for the market
      */
    function decimals() external view returns(uint256);

    /**
      * @return	bool: The active stat of the market. Inactive markets have
	    *			    ended.
      */
    function active() external view returns(bool);
}
