pragma solidity ^0.5.8;

import "./interfaces/IERC20.sol";

contract Vault {
    //The collateral goals for each round
    uint256[] public fundingGoals;
    //The length of each funding round
    uint256[] public phaseDurations;
    //The creator/researcher/owner
    address public creator;
    //The factory that created this market
    address public factory;
    //The collateral of this vault (token)
    address public collateral;
    //The current phase of funding the vault is on
    uint8 public currentPhase = 0;
    //The market assosiated with this vault
    address public market;
    //The market start time
    uint256 public startTime;

    constructor(
        uint256[] memory _fundingGoals,
        uint256[] memory _phaseDurations,
        address _creator,
        address _colalteral
    )
        public
    {
        // Checks there are the same number of goals as phases
        //  as each goal needs a phase and visa versa.
        require(
            _fundingGoals.length == _phaseDurations.length,
            "There must be the same number of funding goals as phases"
        );
        //Setting contract variables
        fundingGoals = _fundingGoals;
        phaseDurations = _phaseDurations;
        creator = _creator;
        collateral = _colalteral;
        factory = msg.sender;
    }

    modifier onlyCreator() {
        require(msg.sender == creator || msg.sender == factory, "Only the creator of a market can withdraw milestones");
        _;
    }

    /**
      * @dev Allows deploying factory to update the address of the creator
      *         incase the creator looses access to their wallet.
      * @param _newCreator The address of the creators new wallet.
      */
    function updateCreator(address _newCreator)
        public
    {
        require(msg.sender == factory, "Only the deploying factory can change creator address");
        creator = _newCreator;
    }

    /**
      * @dev Sets the starting time of the phases.
      * @param _market the address of the market that will
      *     be sending funds to the vault.
      */
    function startPhase(address _market)
        public
        onlyCreator()
    {
        market = _market;
        startTime = block.timestamp;
    }

    /**
      * @dev Allows the creator to withdraw a funding goal if the phase period has not
      *     expired, and the phases funding goal has been reached. Then
      *     sendes the creator their funds, and increments the phase counter.
      */
    function withdraw()
        public
        onlyCreator()
    {
        //Checks that the phase time has not been exceeded.
        require(
            phaseDurations[currentPhase] >= block.timestamp,
            "The phase time has expired for this round. Market should be ended"
        );
        //Checks that the collateral goal has been met.
        require(
            IERC20(collateral).balanceOf(address(this)) >= fundingGoals[currentPhase],
            "The collateral goal has not been met, but market is still within fundrasing phase"
        );
        //Ensures that the transfer suceesds.
        require(IERC20(collateral).transfer(creator, fundingGoals[currentPhase]), "Transfer failed.");
        //Increases the phase the project is on
        currentPhase = currentPhase + 1;
    }

    function withdrawAndClose()
        public
        onlyCreator()
    {
        require(
            currentPhase == fundingGoals.length,
            "Market is not in final round, please use withdraw"
        );

    }
}