pragma solidity 0.5.10;

/**
  * @author Veronica - @veronicalc
  * @title  The interface for the molecule vault
  */
interface IMoleculeVault {

    /**
      * @notice Allows an admin of the molecule vault to add another admin.
      * @param  _moleculeAdmin : The address of the new admin to be added.
      */
    function addAdmin(address _moleculeAdmin) external;
    
    /**
      * @notice Allows an admin to transfer funds out of the molecule vault into
      *         the _to address.
      * @param  _to : The address to send the funds to.
      * @param  _amount : The amount of collateral to send to the _to address.
      */
    function transfer(address _to, uint256 _amount) external;

    /**
      * @notice Allows an admin to approve a spender of the collateral in the
      *         molecule vault.
      * @param  _spender : The address of the spender.
      * @param  _amount : The amount the spender will be approved for.
      */
    function approve(address _spender, uint256 _amount) external;

    /**
      * @notice Allows the admin to update the taxation rate charged by the
      *         molecule vault.
      * @param  _newTaxRate : The new taxation rate.
      */
    function updateTaxRate(uint256 _newFeeRate) external returns(bool);

    /**
      * @return address : The address of the collateral tokens contract (ERC20).
      */
    function collateralToken() external view returns(address);

    /**
      * @return uint256 : The tax rate the molecule vault has.
      */
    function feeRate() external view returns(uint256);
}