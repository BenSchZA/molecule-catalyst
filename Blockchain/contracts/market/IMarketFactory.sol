pragma solidity 0.5.10;

/**
  * @author Veronica - @veronicalc
  * @title  The interface for the market factory
  */
interface IMarketFactory {
    /**
      * @dev    This function allows for the creation of a
      *         new market, consisting of a curve and vault
      * @notice Vyper cannot handle arrays of unknown length,
      *         and thus the funding goals and durations will
      *         only be stored in the vault, which is Solidity.
      * @param  _fundingGoals This is the amount wanting to be
      *         raised in each round, in collateral.
      * @param  _phaseDurations The time for each round in
      *         number of blocks.
      * @param	_creator Address of the researcher.
      * @param	_curveType Curve selected
      * @param	_feeRate The pecentage of fee. e.g: 60
      */
    function deployMarket(
        uint256[] calldata _fundingGoals,
        uint256[] calldata _phaseDurations,
        address _creator,
        uint256 _curveType,
        uint256 _feeRate
    )
        external;

    /**
      * @notice This function will only affect new markets, and will not update
      *         already created markets. This can only be called by an admin
      */
    function updateMoleculeVault(address _newMoleculeVault) external;

	/**
	  * @return	address : The address of the molecule vault contract.
	  */
    function moleculeVault() external view returns(address);

	/**
	  * @return	address : The address of the market registry cotnract.
	  */
    function marketRegistry() external view returns(address);

	/**
	  * @return	address : The address of the curve registry contract
	  */
    function curveRegistry() external view returns(address);

	/**
	  * @return	address : The address of the collateral token contract
	  */
    function collateralToken() external view returns(address);
}
