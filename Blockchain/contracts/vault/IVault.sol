pragma solidity 0.5.10;

interface IVault {

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

    function fundingPhase(uint256 _phase) external view returns(uint256, uint256, uint256, uint8);

    function outstandingWithdraw() external view returns(uint256);

    function currentPhase() external view returns(uint256);

    function market() external view returns(address);

    function creator() external view returns(address);

    /// @dev    Used to add an admin
    /// @param _newAdmin        :address The address of the new admin
    function addAdmin(address _newAdmin) external;

    /// @dev    Used to remove admins
    /// @param _oldAdmin        :address The address of the previous admin
    function removeAdmin(address _oldAdmin) external;

    /// @dev    Checking admin rights
    /// @param _account         :address in question
    /// @return bool
    function isAdmin(address _account) external view returns(bool);
}