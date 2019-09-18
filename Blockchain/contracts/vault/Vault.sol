pragma solidity 0.5.10;

import { WhitelistAdminRole } from "openzeppelin-solidity/contracts/access/roles/WhitelistAdminRole.sol";
import { IMoleculeVault } from "../moleculeVault/IMoleculeVault.sol";
import { IERC20 } from "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import { SafeMath } from "openzeppelin-solidity/contracts/math/SafeMath.sol";
import { BokkyPooBahsDateTimeLibrary } from "../_resources/BokkyPooBahsDateTimeLibrary.sol";
import { IVault } from "./IVault.sol";
import { IMarket } from "../market/IMarket.sol";

/**
  * @author @veronicaLC (Veronica Coutts) & @RyRy79261 (Ryan Nobel)
  * @title  Storage and collection of market tax.
  * @notice The vault stores the tax from the market until the funding goal is
  *         reached, thereafter the creator may withdraw the funds. If the
  *         funding is not reached within the stipulated time-frame, or the
  *         creator terminates the market, the funding is sent back to the
  *         market to be re-distributed.
  * @dev    The vault pulls the mol tax directly from the molecule vault.
  */
contract Vault is IVault, WhitelistAdminRole {
    // For math functions with overflow & underflow checks
    using SafeMath for uint256;
    // For keep track of time in months
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
    // The total number of funding rounds
    uint256 internal totalRounds_;
    // The total cumulative tax received from market
    uint256 internal cumulativeReceivedTax_;
    // If the vault has been initialized
    bool internal _active;
    
    // All funding phases information to their position in mapping
    mapping(uint256 => FundPhase) internal fundingPhases_;

    // Information stored about each phase
    struct FundPhase{
        uint256 fundingThreshold;   // Collateral limit to trigger funding
        uint256 cumulativeFundingThreshold; // The cumulative funding goals
        uint256 fundingRaised;      // The amount of funding raised
        uint256 phaseDuration;      // Period of time for round (start to end)
        uint256 startDate;
        FundingState state;         // State enum
    }

    event FundingWithdrawn(uint256 phase, uint256 amount);
    event PhaseFinalised(uint256 phase, uint256 amount);

    /**
      * @dev    Checks the range of funding rounds (1-9). Gets the Molecule tax
      *         from the molecule vault directly.
      * @param  _fundingGoals : uint256[] - The collateral goal for each funding
      *         round.
      * @param  _phaseDurations : uint256[] - The time limit of each fundign
      *         round.
      * @param  _creator : address - The creator
      * @param  _collateralToken : address - The ERC20 collateral token
      * @param  _moleculeVault : address - The molecule vault
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
        require(
            _fundingGoals.length == _phaseDurations.length,
            "Invalid phase configuration"
        );

        // Storing variables in stoage
        super.addWhitelistAdmin(_creator);
        outstandingWithdraw_ = 0;
        creator_ = _creator;
        collateralToken_ = IERC20(_collateralToken);
        moleculeVault_ = IMoleculeVault(_moleculeVault);
        moleculeTaxRate_ = moleculeVault_.taxRate();

        // Saving the funding rounds into storage
        uint256 loopLength = _fundingGoals.length;
        for(uint8 i = 0; i < loopLength; i++){
            // Works out the rounds tax
            uint256 withTax = _fundingGoals[i].add(
                _fundingGoals[i].mul(moleculeTaxRate_).div(100)
            );
            // Saving the funding threashold with tax
            fundingPhases_[i].fundingThreshold = withTax;
            // Setting the amount of funding raised so far
            fundingPhases_[i].fundingRaised = 0;
            // Setting the phase duration
            fundingPhases_[i].phaseDuration = _phaseDurations[i];
            // Counter for the total number of rounds
            totalRounds_ = totalRounds_.add(1);
        }

        // Sets the start time to the current time
        fundingPhases_[0].startDate = block.timestamp;
        // Setting the state of the current phase to started
        fundingPhases_[0].state = FundingState.STARTED;
        // Setting the storage of the current phase
        currentPhase_ = 0;
    }

    /**
      * @notice Ensures that only the market may call the function.
      */
    modifier onlyMarket(){
        require(msg.sender == address(market_), "Invalid requesting account");
        _;
    }

    /**
      * @notice Ensures that the vault gets initialized before use.
      */
    modifier isActive() {
        require(_active, "Vault has not been initialized.");
        _;
    }

    /**
      * @dev    Initialized the contract, sets up owners and gets the market
      *         address. This function exists becuase the Vault does not have
      *         an address untill the constructor has funished running. The
      *         cumulative funding threshold is set here becuse of gas issues
      *         within the constructor.
      * @param _market : The market that will be sending this vault it's
      *         collateral.
      */
    function initialize(
        address _market
    )
        external
        onlyWhitelistAdmin()
        returns(bool)
    {
        require(_market != address(0), "Contracts initalised");
        // Stores the market in storage
        market_ = IMarket(_market);
        // Removes the market factory contract as an admin
        super.renounceWhitelistAdmin();

        // Adding all previous rounds funding goals to the cumulative goal
        for(uint8 i = 0; i > totalRounds_; i++) {
            if(i == 0) {
                fundingPhases_[i].cumulativeFundingThreshold.add(
                    fundingPhases_[i].fundingThreshold
                );
            }
            fundingPhases_[i].cumulativeFundingThreshold.add(
                fundingPhases_[i-1].cumulativeFundingThreshold
            );
        }
        _active = true;

        return true;
    }

    /**
      * @notice Allows the creator to withdraw a round of funding.
      * @dev    The withdraw function should be called after each funding round
      *         has been sucessfully filled. If the withdraw is called after the
      *         last round has ended, the market will terminate and any
      *         remaining funds will be sent to the market.
      * @param  _phase : The phase the creator wants to withdraw.
      * @return bool : The funding has sucessfully been transfered.
      */
    function withdraw(
        uint256 _phase
    )
        external
        isActive()
        onlyWhitelistAdmin()
        returns(bool)
    {
        require(
            fundingPhases_[_phase].state == FundingState.ENDED,
            "Fund phase incomplete"
        );
        require(outstandingWithdraw_ > 0, "No funds to withdraw");

        // Removes this rounds funding from the outstanding withdraw
        outstandingWithdraw_ = outstandingWithdraw_.sub(
            fundingPhases_[_phase].fundingThreshold
        );
        // Sets the rounds funding to be paid
        fundingPhases_[_phase].state = FundingState.PAID;
        // Works out the mol tax (included in the funding threashold) and sends
        // the funding to the molecule vault
        uint256 molTax = fundingPhases_[_phase].fundingThreshold
            .mul(moleculeTaxRate_)
            .div(moleculeTaxRate_.add(100));
        // Transfers the mol tax to the molecle vault
        require(
            collateralToken_.transfer(address(moleculeVault_), molTax),
            "Tokens not transfer"
        );
        // Working out the origional funding goal without the mol tax
        uint256 creatorAmount = fundingPhases_[_phase].fundingThreshold
            .sub(molTax);
        // Sending the creator their collateral amoutn
        require(
            collateralToken_.transfer(msg.sender, creatorAmount),
            "Tokens not transfer"
        );
        
        emit FundingWithdrawn(_phase, creatorAmount);
        
        // This checks if the current round is the last round, if it is, it
        // terminates the market and sends all remaing funds to the market.
        if(fundingPhases_[currentPhase_].state == FundingState.NOT_STARTED) {
            if(market_.active()) {
                // This will transfer any remianing funding to the market
                terminateMarket();
            }
        }
        return true;
    }

    /**
      * @notice Allows the market to check that the funding
      * @dev 
      */
    function validateFunding(uint256 _receivedFunding) external isActive() onlyMarket() returns(bool){
        require(fundingPhases_[currentPhase_].state == FundingState.STARTED, "Funding inactive");

        uint256 endOfPhase = fundingPhases_[currentPhase_].startDate.addMonths(fundingPhases_[currentPhase_].phaseDuration);
        // Invalidates mint in market if the rounds time has expired.
        if(endOfPhase <= block.timestamp) {
            // terminateMarket();
            return false;
        }
        // Gets the balance of the vault against the collateral token
        uint256 balance = collateralToken_.balanceOf(address(this));
        // Adds the tax to the funding raised for this round
        fundingPhases_[currentPhase_].fundingRaised = fundingPhases_[currentPhase_].fundingRaised.add(_receivedFunding);
        // Adds received funding to the cumulative record of tax received
        cumulativeReceivedTax_.add(_receivedFunding);
        // Ensures the total tax recived finishes the current rounds funding goal
        if(
            fundingPhases_[currentPhase_].cumulativeFundingThreshold <= cumulativeReceivedTax_ &&
            balance.sub(outstandingWithdraw_) >= fundingPhases_[currentPhase_].fundingThreshold
        ) {
            // Ensures that the round has been funded corectly
            assert(fundingPhases_[currentPhase_].fundingRaised >= fundingPhases_[currentPhase_].fundingThreshold);
            // end current round will check if there is excess funding and add it to the next round, as well as
            // incremeting the current round
            _endCurrentRound();
            // Checks if the funding raised is larger than this rounds goal (excess fudning)
            if(fundingPhases_[currentPhase_].fundingRaised > fundingPhases_[currentPhase_].fundingThreshold) {
                // Ends the round
                _endCurrentRound();
                // Ensures the recived funding does not finish any other rounds
                do {
                    // checks if the next funding rounds cumulative funding goal is compleated
                    if(
                        fundingPhases_[currentPhase_].cumulativeFundingThreshold <= cumulativeReceivedTax_ &&
                        balance.sub(outstandingWithdraw_) >= fundingPhases_[currentPhase_].fundingThreshold
                    ) {
                        _endCurrentRound();
                    } else {
                        break;
                    }
                } while(currentPhase_ < totalRounds_);
            }
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
        isActive()
        onlyWhitelistAdmin()
    {
        uint256 remainingBalance = collateralToken_.balanceOf(address(this));

        

        // // This checks if all funding phases completed successfully
        // // Checks if ended or paid for conclusion of phase
        // if(fundingPhases_[currentPhase_].state == FundingState.NOT_STARTED && (fundingPhases_[currentPhase_ - 1].state >= FundingState.ENDED)) {
            // if(outstandingWithdraw_ > 0) {
            //     uint256 marketOverflow = remainingBalance.sub(outstandingWithdraw_);
            //     require(collateralToken_.transfer(creator_, outstandingWithdraw_), "Transfering of funds failed");
            //     outstandingWithdraw_ = 0;
            //     require(collateralToken_.transfer(address(market_), marketOverflow), "Transfering of funds failed");
            // }
            
        //     // Works out the molecule tax amount
        //     // uint256 molTax = remainingBalance.mul(moleculeTaxRate_).div(moleculeTaxRate_.add(100));
        //     // // Transfers amount to the molecule vault
        //     // require(collateralToken_.transfer(address(moleculeVault_), molTax), "Transfering of funds failed");
        //     // // Works out the remaining balance after mol tax, which is fetched
        //     // // incase of remaining fractions from math
        //     // remainingBalance = collateralToken_.balanceOf(address(this));
        //     // // Transfers the amount to the msg.sender
        //     // require(collateralToken_.transfer(creator_, remainingBalance), "Transfering of funds failed");

        //     // emit FundingWithdrawn(currentPhase_, remainingBalance);
        //     require(collateralToken_.transfer(address(market_), remainingBalance), "Transfering of funds failed");
            
        // } else {
            outstandingWithdraw_ = 0;
        //     // Transferes remaining balance to the market
            require(collateralToken_.transfer(address(market_), remainingBalance), "Transfering of funds failed");
        // }
        
        // Sends any funds in the vault to the market
        // require(collateralToken_.transfer(address(market_), remainingBalance), "Transfering of funds failed");
        // Finalizes market (stops buys/sells distributes collateral evenly)
        require(market_.finaliseMarket(), "Market termination error");
    }

    function _endCurrentRound() internal {
        // Setting active phase state to ended
        fundingPhases_[currentPhase_].state = FundingState.ENDED;
        // Works out the excess funding for the round
        uint256 excess = fundingPhases_[currentPhase_].fundingRaised.sub(fundingPhases_[currentPhase_].fundingThreshold);
        // If there is excess, adds it to the next round
        if (excess > 0) {
            fundingPhases_[currentPhase_.add(1)].fundingRaised = fundingPhases_[currentPhase_.add(1)].fundingRaised.add(excess);
            fundingPhases_[currentPhase_].fundingRaised = fundingPhases_[currentPhase_].fundingThreshold;
        }
        outstandingWithdraw_ = outstandingWithdraw_.add(fundingPhases_[currentPhase_].fundingThreshold);

        currentPhase_ = currentPhase_ + 1;
        // Here we check if this was the final round to
        // Set the states apprpriately
        if(fundingPhases_[currentPhase_].fundingThreshold > 0) {
            // Setting active phase state to Started
            fundingPhases_[currentPhase_].state = FundingState.STARTED;
            fundingPhases_[currentPhase_].startDate = block.timestamp;
        }

        // TODO Checks if its the final round and if it is terminates market.

        emit PhaseFinalised(currentPhase_.sub(1), fundingPhases_[currentPhase_.sub(1)].fundingThreshold);
    }

    /**
      * @param _phase : uint256 - The phase that you want the information of
      * @return All stored information about the market.
      */
    function fundingPhase(uint256 _phase) public view returns(uint256, uint256, uint256, uint256, FundingState) {
        return (
            fundingPhases_[_phase].fundingThreshold,
            fundingPhases_[_phase].fundingRaised,
            fundingPhases_[_phase].phaseDuration,
            fundingPhases_[_phase].startDate,
            fundingPhases_[_phase].state
        );
    }

    /**
      * @dev The offset for checking the funding threshold
      */
    function outstandingWithdraw() public view returns(uint256){
        uint256 minusMolTax = outstandingWithdraw_.sub(outstandingWithdraw_.mul(moleculeTaxRate_).div(moleculeTaxRate_.add(100)));
        return minusMolTax;
    }

    /**
      * @dev The current active phase of funding
      */
    function currentPhase() public view returns(uint256) {
        return currentPhase_;
    }

    /**
      * @dev The total number of funding roudns created
      */
    function getTotalRounds() public view returns(uint256) {
        return totalRounds_;
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
