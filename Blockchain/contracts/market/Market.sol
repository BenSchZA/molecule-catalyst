pragma solidity 0.5.10;

import { SafeMath } from "../_resources/openzeppelin-solidity/math/SafeMath.sol";
import { IMarket } from "./IMarket.sol";
import { IVault } from "../vault/IVault.sol";
import { IERC20 } from "../_resources/openzeppelin-solidity/token/ERC20/IERC20.sol";
import { ICurveFunctions } from "../_curveIntegrals/v1/ICurveFunctions.sol";

/**
  * @author Veronica & Ryan of Linum Labs
  * @title Market
  */
contract Market is IMarket, IERC20 {
    using SafeMath for uint256;

    //Allows market to be deactivated after funding
    bool internal active_ = true;
    // Vault that recives taxation
    IVault internal creatorVault_;
    // Percentage of vault taxation i.e 20
    uint256 internal taxationRate_;
    // Address of curve function
    ICurveFunctions internal curveLibrary_;
    // Underlying collateral token
    IERC20 internal collateralToken_;
    // Total minted tokens
    uint256 internal totalSupply_;
    // Decimal accuracy of token
    uint256 internal decimals_ = 18;

    // Allowances for spenders
    mapping(address => mapping (address => uint256)) internal allowed;
    // Balances of token holders
    mapping(address => uint256) internal balances;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint value);
    // event Mint(address indexed to, uint256 amount, uint256 totalCost);
    // event Burn(address indexed from, uint256 amount, uint256 reward);
    event MarketTerminated();

    /**
      * @param _taxationRate        : uint256 - The percentage for taxation i.e 20
      * @param _creatorVault        : address - The vault for taxation to go to
      * @param _curveLibrary        : address - Vyper math module
      * @param _collateralToken     : address - The ERC20 collateral tokem
      */
    constructor(
        uint256 _taxationRate,
        address _creatorVault,
        address _curveLibrary,
        address _collateralToken
    )
        public
    {
        taxationRate_ = _taxationRate;
        creatorVault_ = IVault(_creatorVault);
        curveLibrary_ = ICurveFunctions(_curveLibrary);
        collateralToken_ = IERC20(_collateralToken);
    }

    modifier onlyActive(){
        require(active_, "Market inactive");
        _;
    }

    modifier onlyVault(){
        require(msg.sender == address(creatorVault_), "Invalid requestor");
        _;
    }

    /**
      * @dev                Approves transfers for a given address
      * @param _spender     : address - The account that will receive the funds.
      * @param _value       : uint256 - The value of funds accessed.
      * @return             : boolean - Indicating the action was successful.
      */
    function approve(
        address _spender,
        uint256 _value
    )
        external
        returns (bool)
    {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
      * @dev                Selling tokens back to the bonding curve for collateral
      * @param _numTokens   The number of tokens that you want to burn
      */
    function burn(uint256 _numTokens) external onlyActive() returns(bool) {
        require(balances[msg.sender] >= _numTokens, "Not enough tokens available");

        uint256 rewardForBurn = rewardForBurn(_numTokens);

        totalSupply_ = totalSupply_.sub(_numTokens);
        balances[msg.sender] = balances[msg.sender].sub(_numTokens);

        require(
            collateralToken_.transfer(
                msg.sender,
                rewardForBurn
            ),
            "Tokens not sent"
        );

        // emit Burn(msg.sender, _numTokens, rewardForBurn);
        emit Transfer(msg.sender, address(0), _numTokens);

        return true;
    }

    /// @dev                Mint new tokens with ether
    /// @param _to          :address Address to mint tokens to
    /// @param _numTokens   :uint256 The number of tokens you want to mint
    /// @dev                We have modified the minting function to divert a portion of the purchase tokens
    function mint(address _to, uint256 _numTokens) external onlyActive() returns(bool) {
        uint256 poolBalanceFetched = collateralToken_.balanceOf(address(this));
        uint256 untaxedDai = curveIntegral(totalSupply_.add(_numTokens)).sub(poolBalanceFetched);

        uint256 tax = (untaxedDai.div(100)).mul(taxationRate_);

        collateralToken_.transferFrom(
            msg.sender,
            address(this),
            untaxedDai.add(tax)
        );

        require(
            collateralToken_.transfer(
                creatorVault_,
                tax
            ),
            "Vault portion not sent"
        );

        totalSupply_ = totalSupply_.add(_numTokens);
        balances[msg.sender] = balances[msg.sender].add(_numTokens); // Minus amount sent to Revenue target

        require(creatorVault_.validateFunding(), "Funding validation failed");

        // emit Mint(_to, _numTokens, untaxedDai.add(tax));
        emit Transfer(address(0), _to, _numTokens);
        return true;
    }

    // [ERC20 functions]

    /// @dev                        Transfer ownership token from msg.sender to a specified address
    /// @param _to                  : address The address to transfer to.
    /// @param _value               : uint256 The amount to be transferred.
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value <= balances[msg.sender], "Insufficient funds");
        require(_to != address(0), "Target account invalid");

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /// @dev                Transfer tokens from one address to another
    /// @param _from        :address The address which you want to send tokens from
    /// @param _to          :address The address which you want to transfer to
    /// @param _value       :uint256 the amount of tokens to be transferred
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
        public
        returns (bool)
    {
        require(_value <= balances[_from], "Requested amount exceeds balance");
        require(_value <= allowed[_from][msg.sender], "Allowance exceeded");
        require(_to != address(0), "Target account invalid");

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);

        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

        emit Transfer(_from, _to, _value);
        return true;
    }

    /**
      * @dev    Allows the market to end once all funds have been raised.
      *         Only the vault can end the market.
      */
    function finaliseMarket() public onlyVault() returns(bool) {
        require(active_, "Market deactivated");
        active_ = false;
        emit MarketTerminated();
        return true;
    }

    /**
      * @dev Allows for a token holder to get collateral in return for
      *      their tokens after the market has endedd.
      */
    function withdraw(uint256 _amount) public returns(bool) {
        require(active_ == false, "Market not finalised");
        require(_amount <= balances[msg.sender], "Insufficient funds");

        balances[msg.sender] = balances[msg.sender].sub(_amount);

        uint256 poolBalance = collateralToken_.balanceOf(address(this));

        // TODO: Work out constant pay out value
        // This works out the value of 1 token then caculates what the whole amount is
        uint256 daiToTransfer = (poolBalance.div(totalSupply_)).mul(_amount);
        require(collateralToken_.transfer(msg.sender, daiToTransfer), "Dai transfer failed");

        emit Transfer(address(this), msg.sender, _amount);
    }

    // [Pricing functions]
    /// @dev                Returns the required collateral amount for a volume of bonding curve tokens
    /// @return             :uint256 Required collateral corrected for decimals
    function priceToMint(uint256 _numTokens) public view returns(uint256) {
        uint256 poolBalanceFetched = collateralToken_.balanceOf(address(this));
        uint256 untaxedDai = curveIntegral(totalSupply_.add(_numTokens)).sub(poolBalanceFetched);

        uint256 tax = (untaxedDai.div(100)).mul(taxationRate_);
        return untaxedDai.add(tax);
    }

    /// @dev                Returns the required collateral amount for a volume of bonding curve tokens
    /// @return             Potential return collateral corrected for decimals
    function rewardForBurn(uint256 _numTokens) public view returns(uint256) {
        // TODO: Update
        //       To what? This is the corerct way to get the reward for burn
        uint256 poolBalanceFetched = collateralToken_.balanceOf(address(this));
        return poolBalanceFetched.sub(curveIntegral(totalSupply_.sub(_numTokens)));
    }

    // [Inverse pricing functions]
    /// @dev                This function returns the amount of tokens one can receive for a specified amount of collateral token
    ///                     Including molecule & market contributions
    /// @param  _collateralTokenOffered  :uint256 Amount of reserve token offered for purchase
    function collateralToTokenBuying(uint256 _collateralTokenOffered) external view returns(uint256) {
        //Gets the amount for vault
        // Incoming dai is 100% + taxation rate, implying dividing by 100+taxRate, will produce an accurate 1 percent to work with
        uint256 buyTax = (_collateralTokenOffered.div(taxationRate_.add(100))).mul(taxationRate_);
        //Remaining collateral gets sent to vyper to work out amount of tokens
        uint256 correctedForTax = _collateralTokenOffered.sub(buyTax);
        return (inverseCurveIntegral(curveIntegral(totalSupply_).add(correctedForTax))).sub(totalSupply_);
    }

    /// @dev                            This function returns the amount of tokens needed to be burnt to withdraw a specified amount of reserve token
    ///                                 Including Molecule & market contributions
    /// @param  _collateralTokenNeeded  :uint256 Amount of dai to be withdraw
    function collateralToTokenSelling(uint256 _collateralTokenNeeded) external view returns(uint256) {
        // TODO: Update 
        //       Again, to what?
        return uint256(
            totalSupply_.sub(
                inverseCurveIntegral(curveIntegral(totalSupply_).sub(_collateralTokenNeeded))
            )
        );
    }

    /// @dev                Gets the value of the current allowance specifed for that account
    /// @param _owner       :address The account sending the funds.
    /// @param _spender     :address The account that will receive the funds.
    /// @return             An uint256 representing the amount owned by the passed address.
    function allowance(address _owner, address _spender)
        external
        view
        returns (uint256)
    {
        return allowed[_owner][_spender];
    }

    /// @dev                Gets the balance of the specified address.
    /// @param _owner       :address The address to query the the balance of.
    /// @return             An uint256 representing the amount owned by the passed address.
    function balanceOf(address _owner) external view returns (uint256) {
        return balances[_owner];
    }

    /// @dev                Total collateral backing the curve
    /// @return             A uint256 representing the total collateral backing the curve
    function poolBalance() external view returns (uint256){
        return collateralToken_.balanceOf(address(this));
    }

    /// @dev                Total number of tokens in existence
    /// @return             A uint256 representing the total supply of tokens in this market
    function totalSupply() external view returns (uint256) {
        return totalSupply_;
    }

    /// @dev                Returns the contribution rate for the market on Token purchase
    /// @return             :uint256 The percentage of incoming collateral collected as revenue
    function taxationRate() external view returns(uint256) {
        return taxationRate_;
    }

    /// @dev                Returns the decimals set for the market
    /// @return             :uint256 The decimals set for the market
    function decimals() external view returns(uint256) {
        return decimals_;
    }

    function active() external view returns(bool){
        return active_;
    }

    // Private
    /// @dev                Calculate the integral from 0 to x tokens supply
    /// @param _x            The number of tokens supply to integrate to
    /// @return             The total supply in tokens, not wei
    function curveIntegral(uint256 _x) internal view returns (uint256) {
        return curveLibrary_.curveIntegral(_x);
    }

    /// @dev                Inverse integral to convert the incoming colateral value to token volume
    /// @param _x           :uint256 The volume to identify the root off
    function inverseCurveIntegral(uint256 _x) internal view returns(uint256){
        return curveLibrary_.inverseCurveIntegral(_x);
    }
}
