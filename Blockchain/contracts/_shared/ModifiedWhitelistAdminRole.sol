pragma solidity 0.5.10;

import { Roles } from "openzeppelin-solidity/contracts/access/Roles.sol";

/**
  * @title  ModifiedWhitelistAdminRole
  * @dev    WhitelistAdmins are responsible for assigning and removing 
  *         Whitelisted accounts.
  */
contract ModifiedWhitelistAdminRole {
    using Roles for Roles.Role;

    event WhitelistAdminAdded(address indexed account);
    event WhitelistAdminRemoved(address indexed account);

    Roles.Role private _whitelistAdmins;
    // this is a uint8 rather than a 256 for storage. 
    uint8 internal noOfAdmins_;
    // Initial admin address 
    address internal initialAdmin_;

    constructor () internal {
        _addWhitelistAdmin(msg.sender);
        initialAdmin_ = msg.sender;
    }

    modifier onlyWhitelistAdmin() {
        require(
            isWhitelistAdmin(msg.sender), 
            "ModifiedWhitelistAdminRole: caller does not have the WhitelistAdmin role"
        );
        _;
    }

    /**
      * @dev    This allows for the initial admin added to have additional admin
      *         rights, such as removing another admin. 
      */
    modifier onlyInitialAdmin() {
        require(
            msg.sender == initialAdmin_,
            "Only initial admin may remove another admin"
        );
        _;
    }

    function isWhitelistAdmin(address account) public view returns (bool) {
        return _whitelistAdmins.has(account);
    }

    function addWhitelistAdmin(address account) public onlyWhitelistAdmin() {
        _addWhitelistAdmin(account);
    }

    /**
      * @dev    This allows the initial admin to replace themselves as the super
      *         admin.
      * @param  account: The address of the new super admin
      */
    function addNewInitialAdmin(address account) public onlyInitialAdmin() {
        if(!isWhitelistAdmin(account)) {
            _addWhitelistAdmin(account);
        }
        initialAdmin_ = account;
    }

    function renounceWhitelistAdmin() public {
        _removeWhitelistAdmin(msg.sender);
    }

    /**
      * @dev    Allows the super admin to remover other admins
      * @param  account: The address of the admin to be removed
      */
    function removeWhitelistAdmin(address account) public onlyInitialAdmin() {
        _removeWhitelistAdmin(account);
    }

    function _addWhitelistAdmin(address account) internal {
        if(!isWhitelistAdmin(account)) {
            noOfAdmins_ += 1;
        }
        _whitelistAdmins.add(account);
        emit WhitelistAdminAdded(account);
    }

    function _removeWhitelistAdmin(address account) internal {
        noOfAdmins_ -= 1;
        require(noOfAdmins_ >= 1, "Cannot remove all admins");
        _whitelistAdmins.remove(account);
        emit WhitelistAdminRemoved(account);
    }

    function getAdminCount() public view returns(uint8) {
        return noOfAdmins_;
    }
}
