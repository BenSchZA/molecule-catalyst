pragma solidity 0.5.9;

import { Ownable } from "../_resources/openzeppelin-solidity/ownership/Ownable.sol";
import { Secondary } from "../_resources/openzeppelin-solidity/ownership/Secondary.sol";
import { IMarket } from "../market/IMarket.sol";
import { IERC20 } from "../_resources/openzeppelin-solidity/token/ERC20/IERC20.sol";

// TODO: Consider a mapping with index instead of arrays
contract Vault is Ownable, Secondary {
    address internal market_;
    address internal collateralToken_;
    address internal moleculeVault_;

    uint256 internal currentPhase_;

    mapping(uint256 => FundPhase) internal fundingPhases_;

    struct FundPhase{
        uint256 fundingThreshold; //Collateral limit to trigger funding (with mol tax)
        uint256 fudningGoal; //The origional funding goal
        uint256 phaseDuration; //Period of time from start of phase till end
        uint256 startDate;
        bool fundingWithdrawn; //True when rounds funding is withdrawn
    }

    event FundingWithdrawn(uint256 phase, uint256 amount);
    event PhaseFinalised(uint256 phase, uint256 amount);

    /**
      * @dev Checks the range of funding rounds (1-9) 
      * @param _fundingGoals    The collateral goal for each funding round
      * @param _phaseDurations  The time limit of each fundign round
      * @param _creator         The address of the creator 
      * @param _collateralToken The address of the ERC20 collateral token
      * @param _moleculeVault   The address of the molecule vault
      * @param _moleculeTax     The % of tax to be added to each funding round
      */
    constructor(
        uint256[] memory _fundingGoals,
        uint256[] memory _phaseDurations,
        address _creator,
        address _collateralToken,
        address _moleculeVault,
        uint256 _moleculeTax
    )
        public
    {
        require(_fundingGoals.length > 0, "No funding goals specified");
        require(_fundingGoals.length < 10, "Too many phases defined");
        //Checking that there are the same number of phases in funding and duration
        require(_fundingGoals.length == _phaseDurations.length, "Invalid phase configuration");
        //Sets vault utills
        collateralToken_ = _collateralToken;
        moleculeVault_ = _moleculeVault;
        //Adding all the rounds to the rounds struct 
        uint256 loopLength = _fundingGoals.length;
        for(uint256 i = 0; i < loopLength; i++) {
            fundingPhases_[i].fudningGoal = _fundingGoals[i]
            //Adding mol tax to funding goal
            uint256 fundingGoalTaxCorrected = _fundingGoals[i].add((_fundingGoals[i].mul(_moleculeTax)).div(100));
            fundingPhases_[i].fundingThreshold = fundingGoalTaxCorrected;
            fundingPhases_[i].phaseDuration = _phaseDurations[i];
        }
        //Sets the start date of the phase
        fundingPhases_[0].startDate = now;
        currentPhase_ = 0;
    }

    modifier OnlyAdmin(){
        require(onlyOwner() || , "Invalid requesting account");
        _;
    }

    function initialize(address _market, address _creator) external onlyOwner(){
        require(market_ == address(0), "Already initialised");
        market_ = _market;
        transferOwnership(_creator);
    }//todo: add modifier so functiality only works if contract has been initialized

    /**
      * @notice Could bw changed so that creator can withdraw portions of the funding. 
      *     Would require code changes. 
      */
    function withdraw(uint256 _amount)
        external
        onlyOwner()
        returns(bool)
    {
        require(_validateFunding(currentPhase_), "Round invalid. Phase end exceeded or funding goal not reached");
        require(fundingPhases_.length != currentPhase_, "Please use withdraw and close for final phase");
            //send creator rounds funing
            fundingPhases_[currentPhase_].fundingWithdrawn = true;
            require(
                IERC20(_collateralToken).transfer(_creator, fundingPhases_[currentPhase_].fundingThreshold), 
                "Funding transfer failed"
            );
            emit FundingWithdrawn(currentPhase_, fundingPhases_[currentPhase_].fundingThreshold);
            currentPhase_ = currentPhase_.add(1);
    }

    function withdrawAndClose()
        external
        onlyOwner()
    {
        require(_validateFunding(currentPhase_), "Round invalid. Phase end exceeded or funding goal not reached");
        require(fundingPhases_.length =< currentPhase_, "All phases finished");
        uint256 vaultBalance = IERC20(collateralToken_).balanceOf(address(this));
        fundingPhases_[currentPhase_].fundingWithdrawn = true;
        currentPhase_ = currentPhase_.add(1);
        require(IERC20().transfer(msg.sender, vaultBalance), "Fund transfer failed");
        //todo: lock the market from buying selling, only allow withdraw
    }

    // TODO: in the event of a failed funding round, a function is required to divert all collateral in the Vaults account to a target account
    function failSwitch()
        public
        OnlyOwner()
    {
        
    }

    /**
      * @dev Verifies that the phase passed in: has not been withdrawn, funding goal has been reached,
      *         and that the phase has not expired.
      * @param _phase The phase to be checked 
      */
    function _validateFunding(uint256 _phase) internal returns(bool){
        require(!fundingPhases_[_phase].fundingWithdrawn, "Funding has been wtihdrawn for this round");
        require(
            IERC20(collateralToken_).balanceOf(address(this)) >= fundingPhases_[_phase].fundingThreshold,
            "Funding goal not reached"
        );
        require(
            (fundingPhases_[_phase].startDate + fundingPhases_[_phase].phaseDuration) <= now,
            "Funding phase expired"
        );
    }

    function fundingPhase(uint256 _phase) public view returns(uint256, uint256, uint256, bool) {
        return (
            fundingPhases_[_phase].fundingThreshold,
            fundingPhases_[_phase].phaseDuration,
            fundingPhases_[_phase].startDate,
            fundingPhases_[_phase].fundingWithdrawn
        );
    }

    function currentPhase() public view returns(uint256) {
        return currentPhase_;
    }

    function market() public view returns(address) {
        return market_;
    }

    function creator() public view returns(address) {
        return market_;
    }
}