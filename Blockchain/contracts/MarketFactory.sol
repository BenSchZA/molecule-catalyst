pragma solidity ^0.5.8;

import "./Curve.sol";
import "./Vault.sol";

contract MarketFactory {
    //The address of the Molecule superuser
    address public superUser;
    //The address of the Molecule vault
    address public moleculeVault;
    //The token address to be used for collateral 
    address public collateralToken;
    //The storage struct of a market
    struct Market {
        address curve;
        address vault;
        address creator;
    }
    //Storage used by vault
    mapping(address => Market) public markets;

    event MarketCreated(address indexed curve, address indexed vault, address indexed creator);

    //todo add address for mol valut
    constructor(address _collateralToken) public {
        superUser = msg.sender;
    }

    //Access control to functions
    modifier onlySuper(address _user) {
        require(
            _user == superUser,
            "Only the Molecule superuser can access this function"
        );
        _;
    }//todo steal adminManaged from Protea

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
      */
    function deployMarket(
        uint256[] memory _fundingGoals,
        uint256[] memory _phaseDurations,
        address _creator,
        uint8 _curveType
    )//todo add registry seporatly
        public
        onlySuper(msg.sender)
    {
        //todo: Consider not passing the creator address,
        //      instead pulling it from this factory.
        //      Allows for the address to be changed with min effort
        Vault newVault = new Vault(
            _fundingGoals,
            _phaseDurations,
            _creator,
            collateralToken
        );
        //todo: Consider not passing the curve type to the curve contract,
        //      rather passing gradient/tax % etc, or have multiple preset
        //      curves to choose from, as a curve types does not mean anything
        //      currently.
        Curve newCurve = new Curve(
            _curveType,
            address(newVault),
            collateralToken
        );
        //Adding market to markets
        markets(address(newVault)) = Market({
            curve: address(newCurve),
            vault: address(newVault),
            creator: _creator
        });
        //emitting event for creation
        emit MarketCreated(address(newCurve), address(newVault), _creator);
    }

    function getCreator(address _vault) public returns(address) {
        return markets(_vault).creator;
    }
}