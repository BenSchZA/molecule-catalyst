pragma solidity 0.5.9;

import { Ownable } from "../_resources/openzeppelin-solidity/ownership/Ownable.sol";
import { IMarket } from "../market/IMarket.sol";
import { IERC20 } from "../_resources/openzeppelin-solidity/token/ERC20/IERC20.sol";

// TODO: Consider a mapping with index instead of arrays
contract Vault is Ownable {
    address internal market_;
    address internal collateralToken_;
    address internal moleculeVault_;

    uint256 internal currentPhase_;

    uint256[] internal fundingGoals_;
    uint256[] internal phaseDurations_;

    mapping(uint256 => FundPhase) internal fundingPhases_;

    struct FundPhase{
        uint256 fundingThreshold; // Collateral limit to trigger funding
        uint256 phaseDuration; // Period of time from start of phase till end
        uint256 startDate;
        bool fundingWithdrawn;
    }

    event FundingWithdrawn(uint256 phase, uint256 amount);
    event PhaseFinalised(uint256 phase, uint256 amount);

    constructor(
        uint256[] memory _fundingGoals,
        uint256[] memory _phaseDurations,
        address _creator,
        address _collateralToken,
        address _moleculeVault
    )
        public
    {
        require(_fundingGoals.length > 0, "No funding goals specified");
        require(_fundingGoals.length < 10, "Too many phases defined");
        require(_fundingGoals.length == _phaseDurations.length, "Invalid phase configuration");

        collateralToken_ = _collateralToken;
        moleculeVault_ = _moleculeVault;

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

    function withdraw(uint256 _phase, uint256 _amount)
        external
        onlyOwner()
        returns(bool)
    {
        require(_validateFunding(), "Round invalid. Phase end exceeded or funding goal not reached");
        //todo: check that its not in final phase
            //check phase has not expired and goal has been reached
            //set fundingWithdrawn to true
            //send creator rounds funing
            //todo: set fundingWithdrawn to true & increment current phase
        require(fundingPhases_[_phase].fundingWithdrawn, "Phase not completed");
        require(IMarket(market_).poolBalance() >= fundingPhases_[_phase].fundingThreshold, "Threshold not reached");
    }

    function withdrawAndClose()
        external
        onlyOwner()
    {
        require(_validateFunding(), "Round invalid. Phase end exceeded or funding goal not reached");
        uint256 vaultBalance = IERC20(collateralToken_).balanceOf(address(this));
        //todo: set fundingWithdrawn to true & increment current phase
        require(IERC20().transfer(msg.sender, vaultBalance), "Fund transfer failed");
        //todo: lock the market from buying selling, only allow withdraw
    }

    function _validateFunding() internal returns(bool){
        require(!fundingPhases_[currentPhase_].fundingWithdrawn, "Funding has been wtihdrawn for this round");
        require(
            IERC20(collateralToken_).balanceOf(address(this)) >= fundingPhases_[currentPhase_].fundingThreshold,
            "Funding goal not reached"
        );
        require(
            (fundingPhases_[currentPhase_].startDate + fundingPhases_[currentPhase_].phaseDuration) <= now,
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
}