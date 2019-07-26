pragma solidity 0.5.9;

import { WhitelistAdminRole } from "../_resources/openzeppelin-solidity/access/roles/WhitelistAdminRole.sol";
import { IMoleculeVault } from "../moleculeVault/IMoleculeVault.sol";
import { IERC20 } from "../_resources/openzeppelin-solidity/token/ERC20/IERC20.sol";
import { SafeMath } from "../_resources/openzeppelin-solidity/math/SafeMath.sol";
import { BokkyPooBahsDateTimeLibrary } from "../_resources/BokkyPooBahsDateTimeLibrary.sol";
import { IVault } from "./IVault.sol";

/**
  * @author Veronica & Ryan of Linum Labs
  * @title Vault
  */
contract Vault is IVault, WhitelistAdminRole {
    using SafeMath for uint256;
    using BokkyPooBahsDateTimeLibrary for uint256;

    // The vault benificiary
    address internal creator_;
    // Market feeds collateral to vault
    IMarket internal market_;
    // Underlying collateral token
    IERC20 internal collateralToken_;
    // Vault for molecule tax
    IMoleculeVault internal moleculeVault_;
    // Tax percentage for molecule tax, i.e 50
    uint256 internal moleculeTaxRate_;
    // The funding round that is active
    uint256 internal currentPhase_;
    // Offset for checking funding threashold
    uint256 internal outstandingWithdraw_;
    
    // All funding phases information to their position in mapping
    mapping(uint256 => FundPhase) internal fundingPhases_;

    // States for each funding round
    enum State { NOT_STARTED, STARTED, ENDED, PAID }

    // Information stored about each phase
    struct FundPhase{
        uint256 fundingThreshold;   // Collateral limit to trigger funding
        uint256 phaseDuration;      // Period of time from start of phase till end
        uint256 startDate;
        State state;                // State enum
    }

    event FundingWithdrawn(uint256 phase, uint256 amount);
    event PhaseFinalised(uint256 phase, uint256 amount);

    /**
      * @dev                    Checks the range of funding rounds (1-9)
      * @param _fundingGoals    : uint256[] - The collateral goal for each funding round
      * @param _phaseDurations  : uint256[] - The time limit of each fundign round
      * @param _creator         : address - The creator
      * @param _collateralToken : address - The ERC20 collateral token
      * @param _moleculeVault   : address - The molecule vault
      */
    constructor(
        uint256[] memory _fundingGoals,
        uint256[] memory _phaseDurations,
        address _creator,
        address _collateralToken,
        address _moleculeVault
    )
        public
        WhitelistAdminRole()
    {
        require(_fundingGoals.length > 0, "No funding goals specified");
        require(_fundingGoals.length < 10, "Too many phases defined");
        require(_fundingGoals.length == _phaseDurations.length, "Invalid phase configuration");

        super.addWhitelistAdmin(_creator);

        outstandingWithdraw_ = 0;

        creator_ = _creator;
        collateralToken_ = IERC20(_collateralToken);
        moleculeVault_ = IMoleculeVault(_moleculeVault);

        moleculeTaxRate_ = moleculeVault_.taxRate();

        uint256 loopLength = _fundingGoals.length;
        for(uint256 i = 0; i < loopLength; i++){
            uint256 withTax = _fundingGoals[i].add((_fundingGoals[i].div(100)).mul(moleculeTaxRate_));
            fundingPhases_[i].fundingThreshold = withTax;
            fundingPhases_[i].phaseDuration = _phaseDurations[i];
        }

        fundingPhases_[0].startDate = block.timestamp;
        fundingPhases_[0].state = State.STARTED;
        currentPhase_ = 0;
    }

    modifier onlyMarket(){
        require(msg.sender == address(market_), "Invalid requesting account");
        _;
    }

    /**
      * @dev            Initialized the contract, sets up owners and gets the market
      *                 address.
      * @param _market  : address - The market that will be sending this
      *                 vault it'scollateral.
      */
    function initialize(address _market) external onlyWhitelistAdmin() returns(bool){
        require(_market != address(0), "Contracts initalised");
        market_ = IMarket(_market);
        super.renounceWhitelistAdmin();
        return true;
    }

    /**
      * @dev            Allows a creator to withdraw a specific runds funds
      * @notice         The state of the currentPhase_ will not be 0 untill the last
      *                 phase, where the terminate function will be called.
      * @param _phase   : uint256 - The phase the fund rasing is currently on.
      */
    function withdraw(uint256 _phase) external onlyWhitelistAdmin() returns(bool){
        require(fundingPhases_[_phase].state == 2, "Fund phase incomplete");

        // This checks if we trigger the distribute on the Market
        if(fundingPhases_[currentPhase_].state == State.NOT_STARTED){
            if(market_.active()) {
                terminateMarket(); // This triggers the fund transfer
            }
        } else {
            // This sends the funding for the specified round
            outstandingWithdraw_ = outstandingWithdraw_.sub(fundingPhases_[_phase].fundingThreshold);
            fundingPhases_[_phase].state == State.PAID;

            uint256 molTax = (fundingPhases_[_phase].fundingThreshold.div(moleculeTaxRate_.add(100))).mul(moleculeTaxRate_);
            require(collateralToken_.transfer(address(moleculeVault_), molTax), "Tokens not transfer");

            uint256 creatorAmount = fundingPhases_[_phase].fundingThreshold.sub(molTax);
            require(collateralToken_.transfer(msg.sender, creatorAmount), "Tokens not transfer");
            emit FundingWithdrawn(_phase, creatorAmount);

        }
        return true;
    }

    /**
      * @dev Verifies that the phase passed in: has not been withdrawn, funding goal has been reached,
      *      and that the phase has not expired.
      */
    function validateFunding() external onlyMarket() returns(bool){
        require(fundingPhases_[currentPhase_].state == State.STARTED, "Funding inactive");

        uint256 balance = collateralToken_.balanceOf(address(this));
        // balance = balance.sub(outstandingWithdraw_);

        uint256 endOfPhase = fundingPhases_[currentPhase_].startDate.addMonths(fundingPhases_[currentPhase_].phaseDuration);
        // TODO consider timestamp blocking attacks
        if(endOfPhase <= block.timestamp) {
            return false;
        }

        if(balance >= fundingPhases_[currentPhase_].fundingThreshold) {
            // Setting active phase state to ended
            fundingPhases_[currentPhase_].state = State.ENDED;

            outstandingWithdraw_ = outstandingWithdraw_.add(fundingPhases_[currentPhase_].fundingThreshold);

            currentPhase_ = currentPhase_ + 1;
            // Here we check if this was the final round to
            // Set the states apprpriately
            if(fundingPhases_[currentPhase_].fundingThreshold > 0) {
                // Setting active phase state to Started
                fundingPhases_[currentPhase_].state = State.STARTED;
                fundingPhases_[currentPhase_].startDate = block.timestamp;
            }

            emit PhaseFinalised(currentPhase_.sub(1), fundingPhases_[currentPhase_.sub(1)].fundingThreshold);
        }
        return true;
    }

     /**
       * @dev    This function sends the vaults funds to either the market, or the creator with tax
       *         sent to the moleucle vault.
       * @notice If this function is called before the end of all phases, all funding will be sent
       *         to the market to be redistributed.
       */
    function terminateMarket()
        public
        onlyWhitelistAdmin()
    {
        uint256 remainingBalance = collateralToken_.balanceOf(address(this));

        outstandingWithdraw_ = 0;

        // This checks if all funding phases completed successfully
        // Checks if ended or paid for conclusion of phase
        if(fundingPhases_[currentPhase_].state == State.NOT_STARTED && (fundingPhases_[currentPhase_ - 1].state >= State.ENDED)) {
            // Works out the molecule tax amount
            uint256 molTax = (remainingBalance.div(moleculeTaxRate_.add(100))).mul(moleculeTaxRate_);
            // Transfers amount to the molecule vault
            require(collateralToken_.transfer(address(moleculeVault_), molTax), "Transfering of funds failed");
            // Works out the remaining balance after mol tax, which is fetched
                // incase of remaining fractions from math
            remainingBalance = collateralToken_.balanceOf(address(this));
            // Transfers the amount to the msg.sender
            require(collateralToken_.transfer(creator_, remainingBalance), "Transfering of funds failed");

            emit FundingWithdrawn(currentPhase_, remainingBalance);
        } else {
            // Transferes remaining balance to the market
            require(collateralToken_.transfer(address(market_), remainingBalance), "Transfering of funds failed");
        }
        // Finalizes market (stops buys/sells distributes collateral evenly)
        require(market_.finaliseMarket(), "Market termination error");
    }

    /**
      * @param _phase : uint256 - The phase that you want the information of
      * @return All stored information about the market.
      */
    function fundingPhase(uint256 _phase) public view returns(uint256, uint256, uint256, uint8) {
        return (
            fundingPhases_[_phase].fundingThreshold,
            fundingPhases_[_phase].phaseDuration,
            fundingPhases_[_phase].startDate,
            fundingPhases_[_phase].state
        );
    }

    /**
      * @dev The offset for checking the funding threshold
      */
    function outstandingWithdraw() public view returns(uint256){
        uint256 minusMolTax = outstandingWithdraw_.sub((outstandingWithdraw_.div(moleculeTaxRate_.add(100))).mul(moleculeTaxRate_));
        return minusMolTax;
    }

    /**
      * @dev The current active phase of funding
      */
    function currentPhase() public view returns(uint256) {
        return currentPhase_;
    }

    /**
      * @dev The address of the current market
      */
    function market() public view returns(address) {
        return address(market_);
    }

    function creator() external view returns(address) {
        return creator_;
    }
}