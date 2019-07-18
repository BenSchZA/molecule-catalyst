pragma solidity 0.5.9;

import { Market } from "./Market.sol";
import { Vault } from "../vault/Vault.sol";
import { AdminManaged } from "../_shared/modules/AdminManaged.sol";
import { IMarketRegistry } from "../marketRegistry/IMarketRegistry.sol";
import { ICurveRegistry } from "../curveRegistry/ICurveRegistry.sol";

contract MarketFactory is AdminManaged {
    address internal moleculeVault_;
    address internal marketRegistry_;
    address internal curveRegistry_;
    address internal collateralToken_;

    //todo add address for mol valut
    constructor(address _collateralToken, address _moleculeVault, address _marketRegistry, address _curveRegistry)
        AdminManaged(msg.sender)
        public {
        curveRegistry_ = _curveRegistry;
        collateralToken_ = _collateralToken;
        marketRegistry_ = _marketRegistry;
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
        onlyAdmin()
    {
        (address curveLibrary,, bool curveState) = ICurveRegistry(curveRegistry_).getCurveData(_curveType);

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
        ));//todo: needs to be sent index of curve to get from curve registry

        Vault(newVault).initialize(newMarket, _creator);
        IMarketRegistry(marketRegistry_).registerMarket(newMarket, newVault, _creator);
    }

    function moleculeVault() public view returns(address) {
        return moleculeVault_;
    }

    function marketRegistry() public view returns(address) {
        return marketRegistry_;
    }

    function collateralToken() public view returns(address) {
        return collateralToken_;
    }
}