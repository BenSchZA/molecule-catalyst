pragma solidity 0.5.9;

import { AdminManaged } from "../_shared/modules/AdminManaged.sol";

contract MoleculeVault is AdminManaged{
    address internal collateralToken_;
    uint256 internal taxRate_;

    constructor(address _collateralToken, uint256 _taxRate) public {
        collateralToken_ = _collateralToken;
        taxRate_ = _taxRate;
    }



    function collateralToken() public view {
        return collateralToken_;
    }

    function taxRate() public view {
        return taxRate_;
    }
}