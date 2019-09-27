pragma solidity 0.5.10;

import { Market } from "./Market.sol";
import { IMarketFactory } from "./IMarketFactory.sol";
import { Vault } from "../vault/Vault.sol";
import { WhitelistAdminRole } from "../_resources/openzeppelin-solidity/contracts/access/roles/WhitelistAdminRole.sol";
import { IMarketRegistry } from "../marketRegistry/IMarketRegistry.sol";
import { ICurveRegistry } from "../curveRegistry/ICurveRegistry.sol";
import { IMoleculeVault } from "../moleculeVault/IMoleculeVault.sol";
import { IERC20 } from "../_resources/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

/**
  * @author @veronicaLC (Veronica Coutts) & @RyRy79261 (Ryan Nobel)
  * @title  The creation and co-ordinated storage of markets (a vault and
  *         market).
  * @notice The market factory stores the addresses in the relavant registry.
  */
contract MarketFactory is IMarketFactory, WhitelistAdminRole {
    //The molecule vault for molecule tax
    IMoleculeVault internal moleculeVault_; // todo make storage as ImolVault
    //The registry of all created markets
    IMarketRegistry internal marketRegistry_;
    //The registry of all curve types
    ICurveRegistry internal curveRegistry_;
    //The ERC20 collateral token contract address
    IERC20 internal collateralToken_; // todo change to the IERC20

    /**
      * @dev    Sets variables for market deployments.
      * @param  _collateralToken Address of the ERC20 collateral token
      * @param  _moleculeVault   The address of the molecule tax vault
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
        WhitelistAdminRole()
        public
    {
        curveRegistry_ = ICurveRegistry(_curveRegistry);
        collateralToken_ = IERC20(_collateralToken);
        marketRegistry_ = IMarketRegistry(_marketRegistry);
        moleculeVault_ = IMoleculeVault(_moleculeVault);
    }

    /**
      * @notice This function allows for the creation of a new market,
      *         consisting of a curve and vault
      * @dev    Vyper cannot handle arrays of unknown length, and thus the
      *         funding goals and durations will only be stored in the vault,
      *         which is Solidity.
      * @param  _fundingGoals This is the amount wanting to be raised in each
      *         round, in collateral.
      * @param  _phaseDurations The time for each round in number of blocks.
      * @param  _creator Address of the researcher.
      * @param  _curveType Curve selected.
      * @param  _taxationRate The pecentage of taxation. e.g: 60
      */
    function deployMarket(
        uint256[] calldata _fundingGoals,
        uint256[] calldata _phaseDurations,
        address _creator,
        uint256 _curveType,
        uint256 _taxationRate
    )
        external
        onlyWhitelistAdmin()
    {
        // Breaks down the return of the curve data
        (address curveLibrary,, bool curveState) = curveRegistry_.getCurveData(
            _curveType
        );

        require(_taxationRate > 0, "Taxation rate too low");
        require(_taxationRate < 100, "Taxation rate too high");

        require(curveState == true, "Curve inactive");
        require(curveLibrary != address(0), "Curve library invalid");
        
        address newVault = address(new Vault(
            _fundingGoals,
            _phaseDurations,
            _creator,
            address(collateralToken_),
            address(moleculeVault_)
        ));

        address newMarket = address(new Market(
            _taxationRate,
            newVault,
            curveLibrary,
            address(collateralToken_)
        ));

        require(Vault(newVault).initialize(newMarket), "Vault not initialised");
        marketRegistry_.registerMarket(newMarket, newVault, _creator);
    }

    /**
      * @notice This function will only affect new markets, and will not update
      *         already created markets.
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
      * @return address : The address of the molecule vault
      */
    function moleculeVault() public view returns(address) {
        return address(moleculeVault_);
    }

    /**
      * @return address : The contract address of the market registry.
      */
    function marketRegistry() public view returns(address) {
        return address(marketRegistry_);
    }

    /**
      * @return address : The contract address of the curve registry
      */
    function curveRegistry() public view returns(address) {
        return address(curveRegistry_);
    }

    /**
      * @return address : The contract address of the collateral token
      */
    function collateralToken() public view returns(address) {
        return address(collateralToken_);
    }
}
