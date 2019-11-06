pragma solidity 0.5.10;

/**
  * @author @veronicaLC (Veronica Coutts) & @RyRy79261 (Ryan Nobel)
  * @title  The interface for the molecule vault
  */
interface IMoleculeVault {

    /**
      * @notice Allows an admin to add another admin.
      * @param  _moleculeAdmin: The address of the new admin.
      */
    function addAdmin(address _moleculeAdmin) external;
    
    /**
      * @notice Allows an admin to transfer colalteral out of the molecule
      *         vault and into another address.
      * @param  _to: The address that the collateral will be transfered to.
      * @param  _amount: The amount of collateral being transfered.
      */
    function transfer(address _to, uint256 _amount) external;

    /**
      * @notice Allows an admin to approve a spender of the molecule vault
      *         collateral.
      * @param  _spender: The address that will be aproved as a spender.
      * @param  _amount: The amount the spender will be approved to spend.
      */
    function approve(address _spender, uint256 _amount) external;

    /**
      * @notice Allows the admin to update the taxation rate charged by the
      *         molecule vault.
      * @param  _newTaxRate: The new taxation rate.
      * @return bool: If the update was successful
      */
    function updateTaxRate(uint256 _newTaxRate) external returns(bool);

    /**
      * @return address: The address of the collateral token.
      */
    function collateralToken() external view returns(address);

    /**
      * @return uint256: The rate of taxation
      */
    function taxRate() external view returns(uint256);
}