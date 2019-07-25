pragma solidity >=0.5.3 < 0.6.0;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b);

    return c;
  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b > 0); // Solidity only automatically asserts when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a);
    uint256 c = a - b;

    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a);

    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }
}

/// @author Ben, Veronica & Ryan of Linum Labs
/// @author Ryan N.                 RyRy79261
/// @title Basic Linear Token Manager
contract CurveFunctions {
  using SafeMath for uint256;

  uint256 internal gradientDenominator_ = 2000; // numerator/denominator DAI/Token
  uint256 internal decimals_ = 18; // For now, assume 10^18 decimal precision

  /// @dev                Calculate the integral from 0 to x tokens supply
  /// @param _x           The number of tokens supply to integrate to
  /// @return             The total supply in tokens, not wei
  function curveIntegral(uint256 _x) internal view returns (uint256) {
    uint256 c = 0;
    return ((_x**2).div(2*gradientDenominator_).add(c.mul(_x)).div(10**decimals_));
  }

  /// @dev                Inverse integral to convert the incoming colateral value to token volume
  /// @param _x           :uint256 The volume to identify the root off
  function inverseCurveIntegral(uint256 _x) internal view returns(uint256){
    return sqrt(2*_x*gradientDenominator_*(10**decimals_));
  }

  /// @dev                Babylonian square rooting using while loops
  /// @param _x           :uint256 The number to identify the root off
  function sqrt(uint256 _x) internal pure returns (uint256) {
    if (_x == 0) return 0;
    else if (_x <= 3) return 1;
    uint256 z = (_x + 1) / 2;
    uint256 y = _x;
    while (z < y)
      /// @why3 invariant { to_int !_z = div ((div (to_int arg_x) (to_int !_y)) + (to_int !_y)) 2 }
      /// @why3 invariant { to_int arg_x < (to_int !_y + 1) * (to_int !_y + 1) }
      /// @why3 invariant { to_int arg_x < (to_int !_z + 1) * (to_int !_z + 1) }
      /// @why3 variant { to_int !_y }
    {
      y = z;
      z = (_x / z + z) / 2;
    }
    return y;
  }
}
