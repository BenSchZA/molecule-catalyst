pragma solidity 0.5.9;

import { Ownable } from "../_resources/openzeppelin-solidity/ownership/Ownable.sol";
import { IMarket } from "../market/IMarket.sol";

// TODO: Consider a mapping with index instead of arrays
contract Vault is Ownable {
    address internal market_;
    address internal collateralToken_;

    uint256 internal currentPhase_;

    uint256[] internal fundingGoals_;
    uint256[] internal phaseDurations_;

    mapping(uint256 => FundPhase) internal fundingPhases_;

    struct FundPhase{
        uint256 fundingThreshold; // Collateral limit to trigger funding
        uint256 phaseDuration; // Period of time from start of phase till end
        uint256 startDate;
        bool fundingReached;
    }

    event FundingWithdrawn(uint256 phase, uint256 amount);
    event PhaseFinalised(uint256 phase, uint256 amount);

    constructor(
        uint256[] memory _fundingGoals,
        uint256[] memory _phaseDurations,
        address _creator,
        address _collateralToken
    )
        public
    {
        require(_fundingGoals.length > 0, "No funding goals specified");
        require(_fundingGoals.length < 10, "Too many phases defined");
        require(_fundingGoals.length == _phaseDurations.length, "Invalid phase configuration");

        collateralToken_ = _collateralToken;

        uint256 loopLength = _fundingGoals.length;
        for(uint256 i = 0; i < loopLength; i++){
            fundingPhases_[i].fundingThreshold = _fundingGoals[i];
            fundingPhases_[i].phaseDuration = _phaseDurations[i];
        }

        fundingPhases_[0].startDate = now;
        currentPhase_ = 0;
    }

    modifier onlyMarket(){
        require(msg.sender == market_, "Invalid requesting account");
        _;
    }

    function initialize(address _market, address _creator) external onlyOwner(){
        require(market_ == address(0), "Already initialised");
        market_ = _market;
        transferOwnership(_creator);
    }

    function withdraw(uint256 _phase, uint256 _amount) external onlyOwner() returns(bool){
        // TODO: Align with required business logic
        require(fundingPhases_[_phase].fundingReached, "Phase not completed");
        require(IMarket(market_).poolBalance() >= fundingPhases_[_phase].fundingThreshold, "Threshold not reached");
    }

    function validateFunding(uint256 _poolBalance) external onlyMarket() returns(bool){
        if(_poolBalance >= fundingPhases_[currentPhase_].fundingThreshold){
            if(fundingPhases_[currentPhase_].startDate + fundingPhases_[currentPhase_].phaseDuration <= now){
                fundingPhases_[currentPhase_].fundingReached = true;
                currentPhase_ = currentPhase_ + 1;
                fundingPhases_[currentPhase_].startDate = now;
            }
        }
        return true;
    }

    function fundingPhase(uint256 _phase) public view returns(uint256, uint256, uint256, bool) {
        return (
            fundingPhases_[_phase].fundingThreshold,
            fundingPhases_[_phase].phaseDuration,
            fundingPhases_[_phase].startDate,
            fundingPhases_[_phase].fundingReached
        );
    }

    function currentPhase() public view returns(uint256) {
        return currentPhase_;
    }

    function market() public view returns(address) {
        return market_;
    }
}