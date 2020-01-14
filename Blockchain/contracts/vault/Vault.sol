pragma solidity 0.5.10;

import { ModifiedWhitelistAdminRole } from "../_shared/ModifiedWhitelistAdminRole.sol";
import { IMoleculeVault } from "../moleculeVault/IMoleculeVault.sol";
import { IERC20 } from "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import { SafeMath } from "openzeppelin-solidity/contracts/math/SafeMath.sol";
import { BokkyPooBahsDateTimeLibrary } from "../_resources/BokkyPooBahsDateTimeLibrary.sol";
import { IVault } from "./IVault.sol";
import { IMarket } from "../market/IMarket.sol";

/**
  * @author @veronicaLC (Veronica Coutts) & @RyRy79261 (Ryan Nobel)
  * @title  Storage and collection of market fee.
  * @notice The vault stores the fee from the market until the funding goal is
  *         reached, thereafter the creator may withdraw the funds. If the
  *         funding is not reached within the stipulated time-frame, or the
  *         creator terminates the market, the funding is sent back to the
  *         market to be re-distributed.
  * @dev    The vault pulls the mol fee directly from the molecule vault.
  */
contract Vault is IVault, ModifiedWhitelistAdminRole {
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
    // Vault for molecule fee
    IMoleculeVault internal moleculeVault_;
    // Fee percentage for molecule fee, i.e 50
    uint256 internal moleculeFeeRate_;
    // The funding round that is active
    uint256 internal currentPhase_;
    // Offset for checking funding threshold
    uint256 internal outstandingWithdraw_;
    // The total number of funding rounds
    uint256 internal totalRounds_;
    // The total cumulative fee received from market
    uint256 internal cumulativeReceivedFee_;
    // If the vault has been initialized and has not reached its funding goal
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

    /**
      * @dev    Checks the range of funding rounds (1-9). Gets the Molecule fee
      *         from the molecule vault directly.
      * @notice Any change in the fee rate in the Molecule Vault will not affect
      *         already deployed vaults. This was done to ensure transparency
      *         and trust in the fee rates.
      * @param  _fundingGoals: The collateral goal for each funding round.
      * @param  _phaseDurations: The time limit of each funding round.
      * @param  _creator: The creator
      * @param  _collateralToken: The ERC20 collateral token
      * @param  _moleculeVault: The molecule vault
      */
    constructor(
        uint256[] memory _fundingGoals,
        uint256[] memory _phaseDurations,
        address _creator,
        address _collateralToken,
        address _moleculeVault
    )
        public
        ModifiedWhitelistAdminRole()
    {
        require(_fundingGoals.length > 0, "No funding goals specified");
        require(_fundingGoals.length < 10, "Too many phases defined");
        require(
            _fundingGoals.length == _phaseDurations.length,
            "Invalid phase configuration"
        );

        // Storing variables in storage
        super.addWhitelistAdmin(_creator);
        outstandingWithdraw_ = 0;
        creator_ = _creator;
        collateralToken_ = IERC20(_collateralToken);
        moleculeVault_ = IMoleculeVault(_moleculeVault);
        moleculeFeeRate_ = moleculeVault_.feeRate();

        // Saving the funding rounds into storage
        uint256 loopLength = _fundingGoals.length;
        for(uint8 i = 0; i < loopLength; i++) {
            if(moleculeFeeRate_ == 0) {
                fundingPhases_[i].fundingThreshold = _fundingGoals[i];
            } else {
                // Works out the rounds fee
                uint256 withFee = _fundingGoals[i].add(
                    _fundingGoals[i].mul(moleculeFeeRate_).div(100)
                );
                // Saving the funding threshold with fee
                fundingPhases_[i].fundingThreshold = withFee;
            }
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
    modifier onlyMarket() {
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
      *         address. This function exists because the Vault does not have
      *         an address until the constructor has finished running. The
      *         cumulative funding threshold is set here because of gas issues
      *         within the constructor.
      * @param _market: The market that will be sending this vault it's
      *         collateral.
      */
    function initialize(
        address _market
    )
        external
        onlyWhitelistAdmin()
        returns(bool)
    {
        require(_market != address(0), "Contracts initialized");
        // Stores the market in storage 
        market_ = IMarket(_market); 
        // Removes the market factory contract as an admin
        super.removeWhitelistAdmin(msg.sender);

        // Adding all previous rounds funding goals to the cumulative goal
        for(uint8 i = 0; i < totalRounds_; i++) {
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
      *         has been successfully filled. If the withdraw is called after the
      *         last round has ended, the market will terminate and any
      *         remaining funds will be sent to the market.
      * @return bool : The funding has successfully been transferred.
      */
    function withdraw()
        external
        isActive()
        onlyWhitelistAdmin()
        returns(bool)
    {
        require(outstandingWithdraw_ > 0, "No funds to withdraw");

        for(uint8 i; i <= totalRounds_; i++) {
            if(fundingPhases_[i].state == FundingState.PAID) {
                continue;
            } else if(fundingPhases_[i].state == FundingState.ENDED) {
                // Removes this rounds funding from the outstanding withdraw
                outstandingWithdraw_ = outstandingWithdraw_.sub(
                    fundingPhases_[i].fundingThreshold
                );
                // Sets the rounds funding to be paid
                fundingPhases_[i].state = FundingState.PAID;

                uint256 molFee = fundingPhases_[i].fundingThreshold
                    .mul(moleculeFeeRate_)
                    .div(moleculeFeeRate_.add(100));
                // Transfers the mol fee to the molecule vault
                require(
                    collateralToken_.transfer(address(moleculeVault_), molFee),
                    "Tokens not transfer"
                );

                // Working out the original funding goal without the mol fee
                uint256 creatorAmount = fundingPhases_[i].fundingThreshold
                    .sub(molFee);

                // Sending the creator their collateral amount
                require(
                    collateralToken_.transfer(msg.sender, creatorAmount),
                    "Tokens not transfer"
                );
                
                emit FundingWithdrawn(i, creatorAmount);
            } else {
                break;
            }
        }

        // This checks if the current round is the last round, if it is, it
        // terminates the market and sends all remaining funds to the market.
        if(
            fundingPhases_[currentPhase_].state == FundingState.NOT_STARTED
        ) {
            if(market_.active() && outstandingWithdraw_ == 0) {
                // This will transfer any remaining funding to the market
                terminateMarket();
            }
        }
        return true;
    }

    /**
      * @notice Allows the market to check that the funding round(s) have not
      *         been completed, and that the market is still open.
      * @dev    This function will terminate the market if the time for the
      *         round is exceeded. This will loose any funding the creator has
      *         not withdrawn.
      * @param  _receivedFunding: The amount of funding received
      * @return bool: Whether or not the funding is valid
      */
    function validateFunding(
        uint256 _receivedFunding
    )
        external
        isActive()
        onlyMarket()
        returns(bool)
    {
        require(
            fundingPhases_[currentPhase_].state == FundingState.STARTED,
            "Funding inactive"
        );

        // Works out the time the phase should end
        uint256 endOfPhase = fundingPhases_[currentPhase_].startDate
            .addMonths(fundingPhases_[currentPhase_].phaseDuration);
        // Invalidates mint in market if the rounds time has expired.
        if(endOfPhase <= block.timestamp) {
            terminateMarket();
            return false;
        }

        // Gets the balance of the vault against the collateral token
        uint256 balance = collateralToken_.balanceOf(address(this));
        // Adds the fee to the funding raised for this round
        fundingPhases_[currentPhase_]
            .fundingRaised = fundingPhases_[currentPhase_]
            .fundingRaised.add(_receivedFunding);
        // Adds received funding to the cumulative record of fee received
        cumulativeReceivedFee_.add(_receivedFunding);

        // Ensures the total fee received finishes the current round
        if(
            fundingPhases_[currentPhase_].cumulativeFundingThreshold <=
                cumulativeReceivedFee_ &&
            balance.sub(outstandingWithdraw_) >=
                fundingPhases_[currentPhase_].fundingThreshold
        ) {
            // Ensures that the round has been funded correctly
            assert(
                fundingPhases_[currentPhase_].fundingRaised >=
                fundingPhases_[currentPhase_].fundingThreshold
            );
            // end current round will check if there is excess funding and add
            // it to the next round, as well as incrementing the current round
            _endCurrentRound();
            // Checks if the funding raised is larger than this rounds goal
            if(
                fundingPhases_[currentPhase_].fundingRaised >
                fundingPhases_[currentPhase_].fundingThreshold
            ) {
                // Ends the round
                _endCurrentRound();
                // Ensures the received funding does not finish any other rounds
                do {
                    // checks if the next funding rounds cumulative funding goal
                    // is completed
                    if(
                        fundingPhases_[currentPhase_]
                            .cumulativeFundingThreshold <=
                            cumulativeReceivedFee_ &&
                        balance.sub(outstandingWithdraw_) >=
                        fundingPhases_[currentPhase_].fundingThreshold
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
      * @dev    This function sends the vaults funds to the market, and sets the
      *         outstanding withdraw to 0.
      * @notice If this function is called before the end of all phases, all
      *         unclaimed (outstanding) funding will be sent to the market to be
      *         redistributed.
      */
    function terminateMarket()
        public
        isActive()
        onlyWhitelistAdmin()
    {
        uint256 remainingBalance = collateralToken_.balanceOf(address(this));
        // This ensures that if the creator has any outstanding funds, that
        // those funds do not get sent to the market.
        if(outstandingWithdraw_ > 0) {
            remainingBalance = remainingBalance.sub(outstandingWithdraw_);
        }
        // Transfers remaining balance to the market
        require(
            collateralToken_.transfer(address(market_), remainingBalance),
            "Transfering of funds failed"
        );
        // Finalizes market (stops buys/sells distributes collateral evenly)
        require(market_.finaliseMarket(), "Market termination error");
    }

    /**
      * @notice Returns all the details (relevant to external code) for a
      *         specific phase.
      * @param  _phase: The phase that you want the information of
      * @return uint256: The funding goal (including mol tax) of the round
      * @return uint256: The amount of funding currently raised for the round
      * @return uint256: The duration of the phase
      * @return uint256: The timestamp of the start date of the round
      * @return FundingState: The enum state of the round (see IVault)
      */
    function fundingPhase(
        uint256 _phase
    )
        public
        view
        returns(
            uint256,
            uint256,
            uint256,
            uint256,
            FundingState
        ) {
        return (
            fundingPhases_[_phase].fundingThreshold,
            fundingPhases_[_phase].fundingRaised,
            fundingPhases_[_phase].phaseDuration,
            fundingPhases_[_phase].startDate,
            fundingPhases_[_phase].state
        );
    }

    /**
	  * @return	uint256: The amount of funding that the creator has earned by
	  *			not withdrawn.
	  */
    function outstandingWithdraw() public view returns(uint256) {
        uint256 minusMolFee = outstandingWithdraw_
            .sub(outstandingWithdraw_
                .mul(moleculeFeeRate_)
                .div(moleculeFeeRate_.add(100))
            );
        return minusMolFee;
    }

    /**
      * @dev    The current active phase of funding
      * @return uint256: The current phase the project is in.
      */
    function currentPhase() public view returns(uint256) {
        return currentPhase_;
    }

    /**
      * @return uint256: The total number of rounds for this project.
      */
    function getTotalRounds() public view returns(uint256) {
        return totalRounds_;
    }

    /**
	  * @return	address: The address of the market that is funding this vault.
	  */
    function market() public view returns(address) {
        return address(market_);
    }

    /**
	  * @return	address: The address of the creator of this project.
	  */
    function creator() external view returns(address) {
        return creator_;
    }

    /**
      * @dev    Ends the round, increments to the next round, rolls-over excess
      *         funding, sets the start date of the next round, if there is one.
      */
    function _endCurrentRound() internal {
        // Setting active phase state to ended
        fundingPhases_[currentPhase_].state = FundingState.ENDED;
        // Works out the excess funding for the round
        uint256 excess = fundingPhases_[currentPhase_]
            .fundingRaised.sub(fundingPhases_[currentPhase_].fundingThreshold);
        // If there is excess, adds it to the next round
        if (excess > 0) {
            // Adds the excess funding into the next round.
            fundingPhases_[currentPhase_.add(1)]
                .fundingRaised = fundingPhases_[currentPhase_.add(1)]
                .fundingRaised.add(excess);
            // Setting the current rounds funding raised to the threshold
            fundingPhases_[currentPhase_]
                .fundingRaised = fundingPhases_[currentPhase_].fundingThreshold;
        }
        // Adding the funished rounds funding to the outstanding withdraw.
        outstandingWithdraw_ = outstandingWithdraw_
            .add(fundingPhases_[currentPhase_].fundingThreshold);
        // Incrementing the current phase
        currentPhase_ = currentPhase_ + 1;
        // Set the states the start time, starts the next round if there is one.
        if(fundingPhases_[currentPhase_].fundingThreshold > 0) {
            // Setting active phase state to Started
            fundingPhases_[currentPhase_].state = FundingState.STARTED;
            // This works out the end time of the previous round
            uint256 endTime = fundingPhases_[currentPhase_
                .sub(1)].startDate
                .addMonths(fundingPhases_[currentPhase_].phaseDuration);
            // This works out the remaining time
            uint256 remaining = endTime.sub(block.timestamp);
            // This sets the start date to the end date of the previous round
            fundingPhases_[currentPhase_].startDate = block.timestamp
                .add(remaining);
        }

        emit PhaseFinalised(
            currentPhase_.sub(1),
            fundingPhases_[currentPhase_.sub(1)].fundingThreshold
        );
    }
}
