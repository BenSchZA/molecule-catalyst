pragma solidity 0.5.10;

import { ModifiedWhitelistAdminRole } from "../_shared/ModifiedWhitelistAdminRole.sol";
import { ICurveRegistry } from "./ICurveRegistry.sol";
/**
  * @author @veronicaLC (Veronica Coutts) & @RyRy79261 (Ryan Nobel)
  * @title  Storage of curves and active deployers.
  */
contract CurveRegistry is ICurveRegistry, ModifiedWhitelistAdminRole {
    // The total number of curves
    uint256 internal numberOfCurves_ = 0;
    // The block number when this contract was published
    uint256 internal publishedBlocknumber_;
    // The init function can only be called once 
    bool internal isInitialized_  = false;

    // Mapping of all the curves deployed by their index
    mapping(uint256 => CurveOption) internal curveContracts_;

    // The information stored about each curve
    struct CurveOption{
        address libraryAddress;
        string curveFunction;
        bool active;
    }

    /**
      * @notice The deployer of this contract will be the admin.
      */
    constructor() public ModifiedWhitelistAdminRole() {
        publishedBlocknumber_ = block.number;
    }

    function init(address _admin) public onlyWhitelistAdmin() {
        require(!isInitialized_, "Contract is initialized");
        super.addNewInitialAdmin(_admin);
        super.renounceWhitelistAdmin();
        isInitialized_ = true;
    }

    /**
      * @dev    Logs the market into the registery.
      * @param  _libraryAddress: Address of the library.
      * @param  _curveFunction: Curve title/statement.
      * @return uint256: Returns the index of market for looking up
      */
    function registerCurve(
        address _libraryAddress,
        string calldata _curveFunction)
        external
        onlyWhitelistAdmin()
        returns(uint256)
    {
        require(
            address(_libraryAddress) != address(0),
            "Address cannot be 0"
        );
        
        uint256 index = numberOfCurves_;
        numberOfCurves_ = numberOfCurves_ + 1;

        curveContracts_[index].libraryAddress = _libraryAddress;
        curveContracts_[index].curveFunction = _curveFunction;
        curveContracts_[index].active = true;

        emit CurveRegisterd(
            index,
            _libraryAddress,
            _curveFunction
        );

        return index;
    }

    /**
      * @notice Allows an dmin to set a curves state to inactive. This function
      *         is for the case of an incorect curve module, or vunrability.
      * @param  _index: The index of the curve to be set as inactive.
      */
    function deactivateCurve(uint256 _index) external onlyWhitelistAdmin() {
        require(
            curveContracts_[_index].active == true,
            "Curve already deactivated"
        );
        require(
            curveContracts_[_index].libraryAddress != address(0),
            "Curve not registered"
        );

        curveContracts_[_index].active = false;

        emit CurveDeactivated(_index, curveContracts_[_index].libraryAddress);
    }

    /**
      * @notice Allows an admin to set a curves state to active.
      * @param  _index: The index of the curve to be set as active.
      */
    function reactivateCurve(uint256 _index) external onlyWhitelistAdmin() {
        require(
            curveContracts_[_index].active == false,
            "Curve already activated"
        );
        require(
            curveContracts_[_index].libraryAddress != address(0),
            "Curve not registered"
        );
        
        curveContracts_[_index].active = true;
        
        emit CurveActivated(_index, curveContracts_[_index].libraryAddress);
    }

    /**
      * @dev    Fetches all data and contract addresses of deployed curves by
      *         index, kept as interface for later intergration.
      * @param  _index: Index of the curve library
      * @return address: The address of the curve
      */
    function getCurveAddress(uint256 _index)
        external
        view
        returns(address)
    {
        return curveContracts_[_index].libraryAddress;
    }

    /**
      * @dev    Fetches all data and contract addresses of deployed curves by
      *         index, kept as interface for later intergration.
      * @param  _index: Index of the curve library.
      * @return address: The address of the math library.
      * @return string: The function of the curve.
      * @return bool: The curves active state.
      */
    function getCurveData(uint256 _index)
        external
        view
        returns(
            address,
            string memory,
            bool
        )
    {
        return (
            curveContracts_[_index].libraryAddress,
            curveContracts_[_index].curveFunction,
            curveContracts_[_index].active
        );
    }

    /**
      * @dev    Fetchs the current number of curves infering maximum callable
      *         index.
      * @return uint256: Returns the total number of curves registered.
      */
    function getIndex()
        external
        view
        returns(uint256)
    {
        return numberOfCurves_;
    }

    /**
      * @dev    In order to look up logs efficently, the published block is
      *         available.
      * @return uint256: The block when the contract was published
      */
    function publishedBlocknumber() external view returns(uint256) {
        return publishedBlocknumber_;
    }
}