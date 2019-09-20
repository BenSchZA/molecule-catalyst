pragma solidity 0.5.10;

/**
  * @author Veronica - @veronicalc & Ryan Nobel - @RyRy
  * @title  The interface for the curve registry.
  */
interface ICurveRegistry {
    event CurveRegisterd(
        uint256 index,
        address indexed libraryAddress,
        string curveFunction
    );

    /**
      * @dev    Logs the market into the registery.
      * @param  _libraryAddress : Address of the library.
      * @param  _curveFunction : Curve title/statement.
      * @return uint256 : Returns the index of market for looking up
      */
    function registerCurve(
        address _libraryAddress,
        string calldata _curveFunction)
        external
        returns(uint256);

    /**
      * @notice Allows an dmin to set a curves state to inactive.
      * @param  _index : The index of the curve to be set as inactive.
      */
    function deactivateCurve(uint256 _index) external;

    /**
      * @notice Allows an admin to set a curves state to active.
      * @param  _index : The index of the curve to be set as active.
      */
    function reactivateCurve(uint256 _index) external;

    /**
      * @dev    Fetches all data and contract addresses of deployed curves by
      *         index, kept as interface for later intergration.
      * @param  _index : Index of the curve library
      */
    function getCurveAddress(uint256 _index)
        external
        view
        returns(address);

    /**
      * @dev    Fetches all data and contract addresses of deployed curves by
      *         index, kept as interface for later intergration.
      * @param  _index : Index of the curve library.
      * @return address : The address of the math library.
      * @return string : The function of the curve.
      * @return bool : The curves active state.
      */
    function getCurveData(uint256 _index)
        external
        view
        returns(
            address,
            string memory,
            bool
        );

    /**
      * @dev    Fetchs the current number of curves infering maximum callable
      *         index.
      * @return uint256 : Returns the total number of curves registered.
      */
    function getIndex()
        external
        view
        returns(uint256);

    /**
      * @dev    In order to look up logs efficently, the published block is
      *         available.
      * @return uint256 : The block when the contract was published
      */
    function publishedBlocknumber() external view returns(uint256);
}