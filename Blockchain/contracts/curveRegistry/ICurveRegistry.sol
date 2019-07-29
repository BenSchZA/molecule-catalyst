pragma solidity 0.5.10;

contract ICurveRegistry {
    event CurveRegisterd(uint256 index, address indexed libraryAddress, string curveFunction);

    /// @dev                            Logs the market into the registery
    /// @param _libraryAddress          :address Address of the library
    /// @param _curveFunction           :address Curve title/statement
    /// @return uint256                 Returns the index of market for looking up
    /// @author Ryan
    function registerCurve(
        address _libraryAddress,
        string calldata _curveFunction)
        external
        returns(uint256);

    function reactivateCurve(uint256 _index) external;

    function deactivateCurve(uint256 _index) external;

    /// Fetching curve data
    /// @param _index                   :uint256 Index of the curve library
    /// @dev                            Fetches all data and contract addresses of deployed curves by index, kept as interface for later intergration
    /// @return curveAddress            Returns a curve address
    /// @author Ryan
    function getCurveAddress(uint256 _index)
        external
        view
        returns(address);

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
        );

    /// @dev                            Fetchs the current number of curves infering maximum callable index
    /// @return Index                   Returns the index of markets for looking up
    /// @author Ryan
    function getIndex()
        external
        view
        returns(uint256);

    /// @dev                            In order to look up logs efficently, the published block is available
    /// @return uint256                 The block when the contract was published
    /// @author Ryan
    function publishedBlocknumber() external view returns(uint256);
}