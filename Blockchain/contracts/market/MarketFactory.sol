pragma solidity 0.5.10;

import { Market } from "./Market.sol";
import { IMarketFactory } from "./IMarketFactory.sol";
import { Vault } from "../vault/Vault.sol";
import { ModifiedWhitelistAdminRole } from "../_shared/ModifiedWhitelistAdminRole.sol";
// import { WhitelistedRole } from "openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";
import { IMarketRegistry } from "../marketRegistry/IMarketRegistry.sol";
import { ICurveRegistry } from "../curveRegistry/ICurveRegistry.sol";
import { IMoleculeVault } from "../moleculeVault/IMoleculeVault.sol";
import { IERC20 } from "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

/**
  * @author @veronicaLC (Veronica Coutts) & @RyRy79261 (Ryan Nobel)
  * @title  The creation and co-ordinated storage of markets (a vault and
  *         market).
  * @notice The market factory stores the addresses in the relevant registry.
  */
contract MarketFactory is IMarketFactory, ModifiedWhitelistAdminRole {
    //The molecule vault for molecule fee
    IMoleculeVault internal moleculeVault_;
    //The registry of all created markets
    IMarketRegistry internal marketRegistry_;
    //The registry of all curve types
    ICurveRegistry internal curveRegistry_;
    //The ERC20 collateral token contract address
    IERC20 internal collateralToken_;
    // Address of market deployer
    address internal marketCreator_;
    // The init function can only be called once 
    bool internal isInitialized_  = false;

    event NewApiAddressAdded(address indexed oldAddress, address indexed newAddress);

    modifier onlyAnAdmin() {
        require(isInitialized_, "Market factory has not been activated");
        require(
            isWhitelistAdmin(msg.sender) || msg.sender == marketCreator_,
            "Functionality restricted to whitelisted admin"
        );
        _;
    }

    /**
      * @dev    Sets variables for market deployments.
      * @param  _collateralToken Address of the ERC20 collateral token
      * @param  _moleculeVault   The address of the molecule fee vault
      * @param  _marketRegistry  Address of the registry of all markets
      * @param  _curveRegistry   Address of the registry of all curve types
      *         funding rounds.
      */
    constructor(
        address _collateralToken,
        address _moleculeVault,
        address _marketRegistry,
        address _curveRegistry
    )
        ModifiedWhitelistAdminRole()
        public
    {
        collateralToken_ = IERC20(_collateralToken);
        moleculeVault_ = IMoleculeVault(_moleculeVault);
        marketRegistry_ = IMarketRegistry(_marketRegistry);
        curveRegistry_ = ICurveRegistry(_curveRegistry);
    }

    /**
      * @notice Inits the market factory
      * @param  _admin The address of the admin contract manager
      * @param  _api The address of the backend market deployer
      */
    function init(
        address _admin,
        address _api
    )
        onlyWhitelistAdmin()
        public
    {
        super.addNewInitialAdmin(_admin);
        marketCreator_ = _api;
        super.renounceWhitelistAdmin();
        isInitialized_ = true;
    }

    function updateApiAddress(
        address _newApiPublicKey
    ) 
        onlyWhitelistAdmin() 
        public 
        returns(address)
    {
        address oldMarketCreator = marketCreator_;
        marketCreator_ = _newApiPublicKey;

        emit NewApiAddressAdded(oldMarketCreator, marketCreator_);
        return _newApiPublicKey;
    }

    /**
      * @notice This function allows for the creation of a new market,
      *         consisting of a curve and vault. If the creator address is the
      *         same as the deploying address the market the initialization of
      *         the market will fail.
      * @dev    Vyper cannot handle arrays of unknown length, and thus the
      *         funding goals and durations will only be stored in the vault,
      *         which is Solidity.
      * @param  _fundingGoals This is the amount wanting to be raised in each
      *         round, in collateral.
      * @param  _phaseDurations The time for each round in months. This number
      *         is covered into block time within the vault.
      * @param  _creator Address of the researcher.
      * @param  _curveType Curve selected.
      * @param  _feeRate The percentage of fee. e.g: 60
      */
    function deployMarket(
        uint256[] calldata _fundingGoals,
        uint256[] calldata _phaseDurations,
        address _creator,
        uint256 _curveType,
        uint256 _feeRate
    )
        external
        onlyAnAdmin()
    {
        // Breaks down the return of the curve data
        (address curveLibrary,, bool curveState) = curveRegistry_.getCurveData(
            _curveType
        );

        require(_feeRate > 0, "Fee rate too low");
        require(_feeRate < 100, "Fee rate too high");
        require(_creator != address(0), "Creator address invalid");
        require(curveState, "Curve inactive");
        require(curveLibrary != address(0), "Curve library invalid");
        
        address newVault = address(new Vault(
            _fundingGoals,
            _phaseDurations,
            _creator,
            address(collateralToken_),
            address(moleculeVault_)
        ));

        address newMarket = address(new Market(
            _feeRate,
            newVault,
            curveLibrary,
            address(collateralToken_)
        ));

        require(Vault(newVault).initialize(newMarket), "Vault not initialized");
        marketRegistry_.registerMarket(newMarket, newVault, _creator);
    }

    /**
      * @notice This function will only affect new markets, and will not update
      *         already created markets. This can only be called by an admin
      */
    function updateMoleculeVault(
        address _newMoleculeVault
    )
        public
        onlyWhitelistAdmin()
    {
        moleculeVault_ = IMoleculeVault(_newMoleculeVault);
    }

    /**
      * @return address: The address of the molecule vault
      */
    function moleculeVault() public view returns(address) {
        return address(moleculeVault_);
    }

    /**
      * @return address: The contract address of the market registry.
      */
    function marketRegistry() public view returns(address) {
        return address(marketRegistry_);
    }

    /**
      * @return address: The contract address of the curve registry
      */
    function curveRegistry() public view returns(address) {
        return address(curveRegistry_);
    }

    /**
      * @return address: The contract address of the collateral token
      */
    function collateralToken() public view returns(address) {
        return address(collateralToken_);
    }
}
