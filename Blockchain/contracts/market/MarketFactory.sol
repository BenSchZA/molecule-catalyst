pragma solidity 0.5.10;

import { Market } from "./Market.sol";
import { IMarketFactory } from "./IMarketFactory.sol";
import { Vault } from "../vault/Vault.sol";
// TODO: Gitmodules
import { WhitelistAdminRole } from "../_resources/openzeppelin-solidity/access/roles/WhitelistAdminRole.sol";
import { IMarketRegistry } from "../marketRegistry/IMarketRegistry.sol";
import { ICurveRegistry } from "../curveRegistry/ICurveRegistry.sol";

contract MarketFactory is IMarketFactory, WhitelistAdminRole {
    //The molecule vault for molecule tax
    address internal moleculeVault_;
    //The registry of all created markets
    IMarketRegistry internal marketRegistry_;
    //The registry of all curve types
    ICurveRegistry internal curveRegistry_;
    //The ERC20 collateral token contract address
    address internal collateralToken_;

    /**
      * @author Veronica @veronicaLC
      * @dev Sets variables for market deployments. Molecule tax cannot
      *         be smaller than 0 (1-99).
      * @param _collateralToken Address of the ERC20 collateral token
      * @param _moleculeVault   The address of the molecule tax vault
      * @param _marketRegistry  Address of the registry of all markets
      * @param _curveRegistry   Address of the registry of all curve types
      *                         funding rounds
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
        collateralToken_ = _collateralToken;
        marketRegistry_ = IMarketRegistry(_marketRegistry);
        moleculeVault_ = _moleculeVault;
    }

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
        uint256 _taxationRate
    )
        external
        onlyWhitelistAdmin()
    {
        (address curveLibrary,, bool curveState) = curveRegistry_.getCurveData(_curveType);

        require(_taxationRate > 0, "Taxation rate too low");
        require(_taxationRate < 100, "Taxation rate too high");

        require(curveState == true, "Curve inactive");
        require(curveLibrary != address(0), "Curve library invalid");
        
        address newVault = address(new Vault(
            _fundingGoals,
            _phaseDurations,
            _creator,
            collateralToken_,
            moleculeVault_
        ));

        address newMarket = address(new Market(
            _taxationRate,
            newVault,
            curveLibrary,
            collateralToken_
        ));

        require(Vault(newVault).initialize(newMarket), "Vault not initialised");
        marketRegistry_.registerMarket(newMarket, newVault, _creator);
    }

    /**
      * @notice This function will only affect new markets, and will not update
      *         already created markets.
      */
    function updateMoleculeVault(address _newMoleculeVault) public onlyWhitelistAdmin() {
        moleculeVault_ = _newMoleculeVault;
    }

    function moleculeVault() public view returns(address) {
        return moleculeVault_;
    }

    function marketRegistry() public view returns(address) {
        return address(marketRegistry_);
    }

    function curveRegistry() public view returns(address) {
        return address(curveRegistry_);
    }

    function collateralToken() public view returns(address) {
        return collateralToken_;
    }
}
