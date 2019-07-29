pragma solidity 0.5.10;

interface IMarketFactory {
    /**
      * @author Veronica - @veronicalc
      * @dev    This function allows for the creation of a
      *         new market, consisting of a curve and vault
      * @notice Vyper cannot handle arrays of unknown length,
      *         and thus the funding goals and durations will
      *         only be stored in the vault, which is Solidity.
      * @param _fundingGoals This is the amount wanting to be
      *             raised in each round, in collateral.
      * @param _phaseDurations The time for each round in
      *             number of blocks.
      * @param _creator Address of the researcher.
      * @param _curveType Curve selected
      * @param _taxationRate The pecentage of taxation. e.g: 60
      */
    function deployMarket(
        uint256[] calldata _fundingGoals,
        uint256[] calldata _phaseDurations,
        address _creator,
        uint256 _curveType,
        uint256 _taxationRate,
        uint256 _gradientDenominator,
        uint256 _scaledShift
    )
        external;

    /**
      * @notice This function will only affect new markets, and will not update
      *         already created markets. This can only be called by an admin
      */
    function updateMoleculeVault(address _newMoleculeVault) public;

    function moleculeVault() external view returns(address);

    function marketRegistry() external view returns(address);

    function curveRegistry() public view returns(address);

    function collateralToken() external view returns(address);
}