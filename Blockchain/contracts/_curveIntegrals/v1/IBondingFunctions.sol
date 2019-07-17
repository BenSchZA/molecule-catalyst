pragma solidity 0.5.9;

/// @author Veronica @ Protea
/// @title Vyper bonding curve functions interface 

interface IBondingFunctions {
    /// @dev            Calculating the curves integral
    /// @param x_t      ?
    /// @param gradientDenominator The gradeint of the curve
    /// @param b        ?
    function curveIntegral(uint256 x_t, uint256 gradientDenominator, uint256 b) external pure returns(uint256);

    /// @dev            Calculates the inverse integral of the curve
    /// @param x_d      ?
    /// @param gradientDenominator The gradeint of the curve
    /// @param b        ? 
    function inverseCurveIntegral(uint256 x_d, uint256 gradientDenominator, uint256 b) external pure returns(uint256);
}
