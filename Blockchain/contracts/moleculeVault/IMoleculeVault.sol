pragma solidity 0.5.10;

interface IMoleculeVault {

    function addAdmin(address _moleculeAdmin) external;
    
    function transfer(address _to, uint256 _amount) external;

    function approve(address _spender, uint256 _amount) external;

    function collateralToken() external view returns(address);

    function taxRate() external view returns(uint256);

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