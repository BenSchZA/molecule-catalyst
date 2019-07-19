pragma solidity 0.5.9;

interface IMoleculeVault {
    function transfer(address _to, uint256 _amount) external;
    
    function approve(address _spender, uint256 _amount) external;

    function collateralToken() external view;

    function taxRate() external view;

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