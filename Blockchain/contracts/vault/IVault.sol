pragma solidity 0.5.10;

interface IVault {
    // States for each funding round
    enum FundingState { NOT_STARTED, STARTED, ENDED, PAID }

    event FundingWithdrawn(uint256 phase, uint256 amount);
    event PhaseFinalised(uint256 phase, uint256 amount);

    function initialize(address _market) external returns(bool);

    function withdraw(uint256 _phase) external returns(bool);

    /**
      * @dev Verifies that the phase passed in: has not been withdrawn, funding goal has been reached,
      *         and that the phase has not expired.
      */
    function validateFunding() external returns(bool);

    function terminateMarket() external;

    function fundingPhase(uint256 _phase) external view returns(uint256, uint256, uint256, FundingState);

    function outstandingWithdraw() external view returns(uint256);

    function currentPhase() external view returns(uint256);

    function market() external view returns(address);

    function creator() external view returns(address);

//----------------------------------------------
//  The below functions are implemeted in and from the WhitelistAdminRole contract
//  so cannot be abstract below, as this causes abstract function issues.
//  These functions are available on the Vault contract.
//----------------------------------------------
    // function isWhitelistAdmin(address account) public view returns (bool) {
    //     return _whitelistAdmins.has(account);
    // }

    // function addWhitelistAdmin(address account) public onlyWhitelistAdmin {
    //     _addWhitelistAdmin(account);
    // }

    // function renounceWhitelistAdmin() public {
    //     _removeWhitelistAdmin(msg.sender);
    // }
}
