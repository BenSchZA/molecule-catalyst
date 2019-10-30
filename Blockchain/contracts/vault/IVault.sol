pragma solidity 0.5.10;

interface IVault {
    // States for each funding round
    enum FundingState { NOT_STARTED, STARTED, ENDED, PAID }
	// Emitted when funding is withdrawn by the creator
    event FundingWithdrawn(uint256 phase, uint256 amount);
	// Emitted when a phase has been successfully filled
    event PhaseFinalised(uint256 phase, uint256 amount);

    /**
      * @notice	Used by the market factory to give the vault the address of the
      *       	market that will be funding it.
      */
    function initialize(address _market) external returns(bool);

    /**
	  * @notice	ALlows the creator to withdraw the various phases as they are
	  *			compleated.
	  */
    function withdraw(uint256 _phase) external returns(bool);

    /**
      * @notice	Verifies that the phase passed in: has not been withdrawn,
	  *			funding goal has been reached, and that the phase has not
	  *			expired. Adds fee amount to the vault pool.
      */
    function validateFunding(uint256 _receivedFunding) external returns(bool);

	/**
	  * @notice	Allows the creator to terminate the market and vault at any
	  * 		time. Calling this function will send all remaining funds to the
	  *			market, including any funds that have not been withdrawn by the
	  *			creator.
	  * @dev 	Does not check there are no outstanding funds.
	  */
    function terminateMarket() external;

    function fundingPhase(
      uint256 _phase
    )
      external
      view
      returns(
        uint256,
        uint256,
        uint256,
        uint256,
        FundingState
      );

	/**
	  * @return	The amount of funding that the creator has earned by not
	  *			withdrawn.
	  */
    function outstandingWithdraw() external view returns(uint256);

	/**
	  * @return	The current phase the project is in.
	  */
    function currentPhase() external view returns(uint256);

	/**
	  * @return	The total number of rounds for this project.
	  */
    function getTotalRounds() external view returns(uint256);

	/**
	  * @return	The address of the market that is funding this vault.
	  */
    function market() external view returns(address);

	/**
	  * @return	The address of the creator of this project.
	  */
    function creator() external view returns(address);
}
