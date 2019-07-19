pragma solidity 0.5.9;

import { AdminManaged } from "../_shared/modules/AdminManaged.sol";

// TODO: Update to outline buisness logic
contract MoleculeVault is AdminManaged{
    address internal collateralToken_;
    uint256 internal taxRate_;

    constructor(address _collateralToken, uint256 _taxRate) public {
        collateralToken_ = _collateralToken;
        taxRate_ = _taxRate;
    }

    function transfer(address _to, uint256 _amount) public onlyAdmin() {
        require(IERC20(collateralToken_).transfer(_to, _amount), "Transfer failed");
    }

    function approve(address _spender, uint256 _amount) public onlyAdmin() {
        require(IERC20(collateralToken_).approve(_spender, _amount), "Approve failed");
    }

    function collateralToken() public view {
        return collateralToken_;
    }

    function taxRate() public view {
        return taxRate_;
    }
}