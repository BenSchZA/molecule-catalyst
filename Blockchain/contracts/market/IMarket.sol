pragma solidity 0.5.9;

/// @author Veronica & Ryan of Linum Labs
/// @title Market
interface IMarket {
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint value);
    event Mint(address indexed to, uint256 amount, uint256 totalCost);
    event Burn(address indexed from, uint256 amount, uint256 reward);

    /// @dev                Approves transfers for a given address
    /// @param _spender     :address The account that will receive the funds.
    /// @param _value       :uint256 The value of funds accessed.
    /// @return             :boolean Indicating the action was successful.
    function approve(address _spender, uint256 _value) external returns (bool);

    /// @dev                Selling tokens back to the bonding curve for collateral
    /// @param _numTokens   The number of tokens that you want to burn
    function burn(uint256 _numTokens) external returns(bool);

    /// @dev                Mint new tokens with ether
    /// @param _to          :address Address to mint tokens to
    /// @param _numTokens   :uint256 The number of tokens you want to mint
    /// @dev                We have modified the minting function to divert a portion of the purchase tokens
    // Rough gas usage 153,440
    function mint(address _to, uint256 _numTokens) external returns(bool);

    // TODO: docs
    function finaliseMarket() external returns(bool);

    // TODO finish withdraw function
    function withdraw(uint256 _amount) public returns(bool);

    // [ERC20 functions]
    /// @dev                        Transfer ownership token from msg.sender to a specified address
    /// @param _to                  : address The address to transfer to.
    /// @param _value               : uint256 The amount to be transferred.
    function transfer(address _to, uint256 _value) external returns (bool);

    /// @dev                Transfer tokens from one address to another
    /// @param _from        :address The address which you want to send tokens from
    /// @param _to          :address The address which you want to transfer to
    /// @param _value       :uint256 the amount of tokens to be transferred
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);

    // [Pricing functions]
    /// @dev                Returns the required collateral amount for a volume of bonding curve tokens
    /// @return             :uint256 Required collateral corrected for decimals
    function priceToMint(uint256 _numTokens) external view returns(uint256);

    /// @dev                Returns the required collateral amount for a volume of bonding curve tokens
    /// @return             Potential return collateral corrected for decimals
    function rewardForBurn(uint256 _numTokens) external view returns(uint256);

    // [Inverse pricing functions]
    /// @dev                This function returns the amount of tokens one can receive for a specified amount of collateral token
    ///                     Including molecule & market contributions
    /// @param  _colateralTokenOffered  :uint256 Amount of reserve token offered for purchase
    function collateralToTokenBuying(uint256 _collateralTokenOffered) external view returns(uint256);

    /// @dev                            This function returns the amount of tokens needed to be burnt to withdraw a specified amount of reserve token
    ///                                 Including Molecule & market contributions
    /// @param  _collateralTokenNeeded  :uint256 Amount of dai to be withdraw
    function collateralToTokenSelling(uint256 _collateralTokenNeeded) external view returns(uint256);

    /// @dev                Gets the value of the current allowance specifed for that account
    /// @param _owner       :address The account sending the funds.
    /// @param _spender     :address The account that will receive the funds.
    /// @return             An uint256 representing the amount owned by the passed address.
    function allowance(address _owner, address _spender) external view returns (uint256);

    /// @dev                Gets the balance of the specified address.
    /// @param _owner       :address The address to query the the balance of.
    /// @return             An uint256 representing the amount owned by the passed address.
    function balanceOf(address _owner) external view returns (uint256);

    /// @dev                Total number of tokens in existence
    /// @return             A uint256 representing the total supply of tokens in this market
    function totalSupply() external view returns (uint256);

    /// @dev                Total collateral backing the curve
    /// @return             A uint256 representing the total collateral backing the curve
    function poolBalance() external view returns (uint256);

    /// @dev                Returns the address where market contibution is sent
    /// @return             :address Address of the contribution storing account
    function moleculeVault() external view returns(address);

    /// @dev                Returns the contribution rate for the market on Token purchase
    /// @return             :uint256 The percentage of incoming collateral collected as revenue
    function contributionRate() external view returns(uint256);

    /// @dev                Returns the decimals set for the market
    /// @return             :uint256 The decimals set for the market
    function decimals() external view returns(uint256);

    // TODO: documentation
    function active() external view returns(bool);
}