pragma solidity 0.5.9;

import { IMarket } from "../market/IMarket.sol";
import { AdminManaged } from "../_shared/modules/AdminManaged.sol";
import { IMoleculeVault } from "../moleculeVault/IMoleculeVault.sol";
import { IERC20 } from "../_resources/openzeppelin-solidity/token/ERC20/IERC20.sol";

// TODO: Consider a mapping with index instead of arrays
contract Vault is AdminManaged {
    address internal creator_;
    address internal market_;
    address internal collateralToken_;
    address internal moleculeVault_;

    uint256 internal moleculeTaxRate_;

    uint256 internal currentPhase_;

    uint256 internal outstandingWithdraw_;

    mapping(uint256 => FundPhase) internal fundingPhases_;

    struct FundPhase{
        uint256 fundingThreshold; // Collateral limit to trigger funding
        uint256 phaseDuration; // Period of time from start of phase till end
        uint256 startDate;
        uint8 state; // 0: Not started, 1: Started, 2: Ended
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
      */
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

        admins_.add(_creator);


        outstandingWithdraw_ = 0;

        creator_ = _creator;
        collateralToken_ = _collateralToken;
        moleculeVault_ = _moleculeVault;

        moleculeTaxRate_ = IMoleculeVault(moleculeVault_).taxRate();

        uint256 loopLength = _fundingGoals.length;
        for(uint256 i = 0; i < loopLength; i++){
            uint256 withTax = _fundingGoals[i].add((_fundingGoals[i].div(100)).mul(moleculeTaxRate_));
            fundingPhases_[i].fundingThreshold = withTax;
            fundingPhases_[i].phaseDuration = _phaseDurations[i];
        }

        fundingPhases_[0].startDate = now;
        fundingPhases_[0].state = 1;
        currentPhase_ = 0;
    }

    modifier onlyMarket(){
        require(msg.sender == market_, "Invalid requesting account");
        _;
    }

    // TODO: get admin managed initialise function
    function initialize(address _market) external onlyAdmin(){
        require(_market == address(0), "Contracts initalised");
        market_ = _market;
        admins_.remove(msg.sender);
        return true;
    }

    function withdraw(uint256 _phase) external onlyAdmin() returns(bool){
        require(fundingPhases_[_phase].state == 2, "Fund phase incomplete");
        require(!fundingPhases_[_phase].fundingWithdrawn, "Funds already withdrawn");

        // This checks if we trigger the distribute on the Market
        if(fundingPhases_[currentPhase_].state == 0){
            if(IMarket(market_).active()){
                terminateMarket(); // This triggers the fund transfer
            }
        }else{
            // This sends the funding for the specified round
            outstandingWithdraw_ = outstandingWithdraw_.sub(fundingPhases_[_phase].fundingThreshold);
            fundingPhases_[_phase].fundingWithdrawn = true;

            uint256 molTax = (fundingPhases_[_phase].fundingThreshold.div(100)).mul(moleculeTaxRate_);
            require(IERC20(collateralToken_).transfer(moleculeVault_, molTax), "Tokens not transfer");

            uint256 creatorAmount = fundingPhases_[_phase].fundingThreshold.sub(molTax);
            require(IERC20(collateralToken_).transfer(msg.sender, creatorAmount), "Tokens not transfer");
            emit FundingWithdrawn(_phase, creatorAmount);

        }
        return true;
    }

    /**
      * @dev Verifies that the phase passed in: has not been withdrawn, funding goal has been reached,
      *         and that the phase has not expired.
      */
    function validateFunding() external onlyMarket() returns(bool){
        require(fundingPhases_[currentPhase_].state == 1, "Funding inactive");

        uint256 balance = IERC20(collateralToken_).balanceOf(address(this));
        balance = balance.sub(outstandingWithdraw_);

        if(balance >= fundingPhases_[currentPhase_].fundingThreshold){
            if(fundingPhases_[currentPhase_].startDate + fundingPhases_[currentPhase_].phaseDuration <= now){
                fundingPhases_[currentPhase_].state = 2; // Setting to ended
                
                outstandingWithdraw_ = outstandingWithdraw_.add(fundingPhases_[currentPhase_].fundingThreshold);

                currentPhase_ = currentPhase_ + 1;
                // Here we check if this was the final round to 
                // Set the states apprpriately 
                if(fundingPhases_[currentPhase_].fundingThreshold > 0){
                    fundingPhases_[currentPhase_].state = 1; // Setting to Started
                    fundingPhases_[currentPhase_].startDate = now;
                }
                emit PhaseFinalised(currentPhase_.sub(1), fundingPhases_[currentPhase_.sub(1)].fundingThreshold);

            }else{
                return false; 
            }
        }
        return true;
    }

     // TODO: in the event of a failed funding round, a function is required to divert all collateral in the Vaults account to a target account
    function terminateMarket()
        public
        onlyAdmin()
    {
        uint256 remainingBalance = IERC20(collateralToken_).balanceOf(address(this));

        outstandingWithdraw_ = 0;

        // This sends all the remaining funding

        // This checks if all funding phases completed successfully
        if(fundingPhases_[currentPhase_].state == 0 && fundingPhases_[currentPhase_ - 1].state == 2){
            uint256 molTax = (remainingBalance.div(100)).mul(moleculeTaxRate_);
            require(IERC20(collateralToken_).transfer(moleculeVault_, molTax), "Transfering of funds failed");

            remainingBalance = IERC20(collateralToken_).balanceOf(address(this)); // Fetching incase of remaining fractions from math
            require(IERC20(collateralToken_).transfer(msg.sender, remainingBalance), "Transfering of funds failed");
            emit FundingWithdrawn(currentPhase_, remainingBalance);
        }else{
            require(IERC20(collateralToken_).transfer(market_, remainingBalance), "Transfering of funds failed");
        }
        require(IMarket(market_).finaliseMarket(), "Market termination error");
    }

    function fundingPhase(uint256 _phase) public view returns(uint256, uint256, uint256, uint8) {
        return (
            fundingPhases_[_phase].fundingThreshold,
            fundingPhases_[_phase].phaseDuration,
            fundingPhases_[_phase].startDate,
            fundingPhases_[_phase].state
        );
    }

    // TODO: in the event of a failed funding round, a function is required to divert all collateral in the Vaults account to a target account
    function outstandingWithdraw() public view returns(uint256){
        uint256 minusMolTax = outstandingWithdraw_.sub((outstandingWithdraw_.div(100)).mul(moleculeTaxRate_));
        return minusMolTax;
    }
    function currentPhase() public view returns(uint256) {
        return currentPhase_;
    }

    function market() public view returns(address) {
        return market_;
    }
}