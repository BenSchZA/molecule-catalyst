pragma solidity 0.5.9;

/// @author Veronica @ Protea
/// @title Bonding curve functions interface 

interface ICurveFunctions {
    /// @dev            Calculates the definite integral of the curve
    /// @param x_t      token value for upper limit of definite integral
    function curveIntegral(uint256 x_t) external pure returns(uint256);

    /// @dev            Calculates the definite inverse integral of the curve
    /// @param x_d      collateral value for upper limit of definite integral
    function inverseCurveIntegral(uint256 x_d) external pure returns(uint256);
}
