pragma solidity 0.5.9;

import { AdminManaged } from "../_shared/modules/AdminManaged.sol";

contract CurveRegistry is AdminManaged {
    uint256 internal numberOfCurves_ = 0;
    uint256 internal publishedBlocknumber_;

    mapping(uint256 => CurveOption) internal curveContracts_;

    struct CurveOption{
        address libraryAddress;
        string curveFunction;
        bool active;
    }

    event CurveRegisterd(uint256 index, address indexed libraryAddress, string curveFunction);
    event CurveActivated(uint256 index, address indexed libraryAddress);
    event CurveDeactivated(uint256 index, address indexed libraryAddress);

    constructor() public AdminManaged(msg.sender){
        publishedBlocknumber_ = block.number;
    }

    /// @dev                            Logs the market into the registery
    /// @param _libraryAddress          :address Address of the library
    /// @param _curveFunction           :address Curve title/statement
    /// @return uint256                 Returns the index of market for looking up
    /// @author Ryan
    function registerCurve(
        address _libraryAddress,
        string calldata _curveFunction)
        external
        onlyAdmin()
        returns(uint256)
    {
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
      * @dev            Sets the curve to active
      * @param _index   : uint256 - The index of the curve
      */
    function reactivateCurve(uint256 _index) external onlyAdmin {
        require(curveContracts_[_index].active == false, "Curve already activated");
        require(curveContracts_[_index].libraryAddress != address(0), "Curve not registered");
        curveContracts_[_index].active = true;
        
        emit CurveActivated(_index, curveContracts_[_index].libraryAddress);
    }

    /**
      * @dev            Sets the curve to inactive
      * @notice         This function is for the case of an incorect
      *                 curve module, or vunrability
      * @param _index   : uint256 - The index of the curve
      */
    function deactivateCurve(uint256 _index) external onlyAdmin {
        require(curveContracts_[_index].active == true, "Curve already deactivated");
        require(curveContracts_[_index].libraryAddress != address(0), "Curve not registered");
        curveContracts_[_index].active = false;

        emit CurveDeactivated(_index, curveContracts_[_index].libraryAddress);
    }

    /// Fetching curve data
    /// @param _index                   :uint256 Index of the curve library
    /// @dev                            Fetches all data and contract addresses of deployed curves by index, kept as interface for later intergration
    /// @return curveAddress            Returns a curve address
    /// @author Ryan
    function getCurveAddress(uint256 _index)
        external
        view
        returns(address)
    {
        return curveContracts_[_index].libraryAddress;
    }

    /// @param _index                   :uint256 Index of the curve library
    /// @dev                            Fetches all data and contract addresses of deployed curves by index, kept as interface for later intergration
    /// @return curve                   Returns curve data
    /// @author Ryan
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

    /// @dev                            Fetchs the current number of curves infering maximum callable index
    /// @return Index                   Returns the index of markets for looking up
    /// @author Ryan
    function getIndex()
        external
        view
        returns(uint256)
    {
        return numberOfCurves_;
    }

    /// @dev                            In order to look up logs efficently, the published block is available
    /// @return uint256                 The block when the contract was published
    /// @author Ryan
    function publishedBlocknumber() external view returns(uint256) {
        return publishedBlocknumber_;
    }
}