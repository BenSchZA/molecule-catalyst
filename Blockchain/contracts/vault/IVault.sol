pragma solidity 0.5.10;

/**
  * @author @veronicaLC (Veronica Coutts) & @RyRy79261 (Ryan Nobel)
  * @title  Storage and collection of market tax.
  * @notice The vault stores the tax from the market until the funding goal is
  *         reached, thereafter the creator may withdraw the funds. If the
  *         funding is not reached within the stipulated time-frame, or the
  *         creator terminates the market, the funding is sent back to the
  *         market to be re-distributed.
  * @dev    The vault pulls the mol tax directly from the molecule vault.
  */
interface IVault {
	// States for each funding round
	enum FundingState { NOT_STARTED, STARTED, ENDED, PAID }
	// Emitted when funding is withdrawn by the creator
	event FundingWithdrawn(uint256 phase, uint256 amount);
	// Emitted when a phase has been successfully filled
	event PhaseFinalised(uint256 phase, uint256 amount);

   	/**
      * @dev    Initialized the contract, sets up owners and gets the market
      *         address. This function exists becuase the Vault does not have
      *         an address untill the constructor has funished running. The
      *         cumulative funding threshold is set here becuse of gas issues
      *         within the constructor.
      * @param _market: The market that will be sending this vault it's
      *         collateral.
      */
    function initialize(address _market) external returns(bool);

    /**
	  * @notice	ALlows the creator to withdraw the various phases as they are
	  *			compleated.
      * @return bool: The funding has sucessfully been transfered.
	  */
    function withdraw() external returns(bool);

    /**
      * @notice	Verifies that the phase passed in: has not been withdrawn,
	  *			funding goal has been reached, and that the phase has not
	  *			expired. Adds fee amount to the vault pool.
      * @param  _receivedFunding: The amount of funding recived
      * @return bool: Wheather or not the funding is valid
      */
    function validateFunding(uint256 _receivedFunding) external returns(bool);

	/**
      * @dev    This function sends the vaults funds to the market, and sets the
      *         outstanding withdraw to 0.
      * @notice If this function is called before the end of all phases, all
      *         unclaimed (outstanding) funding will be sent to the market to be
      *         redistributed.
      */
    function terminateMarket() external;

	/**
      * @notice Returns all the details (relavant to external code) for a
      *         specific phase.
      * @param  _phase: The phase that you want the information of
      * @return uint256: The funding goal (including mol tax) of the round
      * @return uint256: The amount of funding currently raised for the round
      * @return uint256: The duration of the phase
      * @return uint256: The timestamp of the start date of the round
      * @return FundingState: The enum state of the round (see IVault)
      */
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
	  * @return	uint256: The amount of funding that the creator has earned by
	  *			not withdrawn.
	  */
    function outstandingWithdraw() external view returns(uint256);

	/**
      * @dev    The current active phase of funding
      * @return uint256: The current phase the project is in.
      */
    function currentPhase() external view returns(uint256);

	/**
      * @return uint256: The total number of rounds for this project.
      */
    function getTotalRounds() external view returns(uint256);

	/**
	  * @return	address: The address of the market that is funding this vault.
	  */
    function market() external view returns(address);

	/**
	  * @return	address: The address of the creator of this project.
	  */
    function creator() external view returns(address);
}