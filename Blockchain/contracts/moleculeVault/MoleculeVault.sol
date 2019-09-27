pragma solidity 0.5.10;

import { WhitelistAdminRole } from "../_resources/openzeppelin-solidity/contracts/access/roles/WhitelistAdminRole.sol";
import { IERC20 } from "../_resources/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import { IMoleculeVault } from "./IMoleculeVault.sol";

/**
  * @author @veronicaLC (Veronica Coutts) & @RyRy79261 (Ryan Nobel)
  * @title  Storage and acess to the molecule tax.
  * @notice The vault will send the molecule vault its tax rate when a round of
  *         funding has been successfully filled.
  */
contract MoleculeVault is IMoleculeVault, WhitelistAdminRole {
    // The collateral token being used by the vaults and markets
    IERC20 internal collateralToken_;
    // The tax rate of the molecule vault
    uint256 internal taxRate_;

    /**
      * @notice Setts the state variables for the contract.
      * @param  _collateralToken : The address of the collateral token (ERC20).
      * @param  _taxRate : The taxation rate to be used by the vaults.
      */
    constructor(
        address _collateralToken,
        uint256 _taxRate
    )
        public
        WhitelistAdminRole()
    {
        // Ensures that the tax rate is correct
        require(_taxRate > 0, "Taxation rate too low");
        require(_taxRate < 100, "Taxation rate too high");

        collateralToken_ = IERC20(_collateralToken);
        taxRate_ = _taxRate;
    }

    /**
      * @notice Allows an admin to add another admin.
      * @param  _moleculeAdmin : The address of the new admin.
      */
    function addAdmin(address _moleculeAdmin) external onlyWhitelistAdmin() {
        // Adding the Molecule admin address as an admin
        super.addWhitelistAdmin(_moleculeAdmin);
    }

    /**
      * @notice Allows an admin to transfer colalteral out of the molecule
      *         vault and into another address.
      * @param  _to : The address that the collateral will be transfered to.
      * @param  _amount : The amount of collateral being transfered.
      */
    function transfer(
        address _to,
        uint256 _amount
    )
        public
        onlyWhitelistAdmin()
    {
        require(
            IERC20(collateralToken_).transfer(_to, _amount),
            "Transfer failed"
        );
    }

    /**
      * @notice Allows an admin to approve a spender of the molecule vault
      *         collateral.
      * @param  _spender : The address that will be aproved as a spender.
      * @param  _amount : The amount the spender will be approved to spend.
      */
    function approve(
        address _spender,
        uint256 _amount
    )
        public
        onlyWhitelistAdmin()
    {
        require(
            IERC20(collateralToken_).approve(_spender, _amount),
            "Approve failed"
        );
    }

    /**
      * @notice Allows the admin to update the taxation rate charged by the
      *         molecule vault.
      * @param  _newTaxRate : The new taxation rate.
      */
    function updateTaxRate(
        uint256 _newTaxRate
    )
        external
        onlyWhitelistAdmin()
        returns(bool)
    {
        require(
            taxRate_ != _newTaxRate,
            "New taxation rate cannot be the same as old taxation rate"
        );

        taxRate_ = _newTaxRate;
    }

    /**
      * @return address : The address of the collateral token.
      */
    function collateralToken() public view returns(address) {
        return address(collateralToken_);
    }

    /**
      * @return uint256 : The rate of taxation
      */
    function taxRate() public view returns(uint256) {
        return taxRate_;
    }
}