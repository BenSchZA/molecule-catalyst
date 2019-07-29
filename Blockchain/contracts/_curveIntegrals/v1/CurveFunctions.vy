# @author Ben Scholtz @ Linum Labs
# @title Bonding curve functions

# Configure decimal point precision and scaling
DECIMALS: constant(int128) = 18
SCALE: constant(decimal) = convert(10**DECIMALS, decimal)
SCALE_10: constant(decimal) = convert(10**10, decimal)
SCALE_8: constant(decimal) = convert(10**8, decimal)

# Linear bonding curve configuration
# f(x) = (1/17500)*x + 0.5
GRADIENT: constant(decimal) = 5714.2857142857
VERTICAL_SHIFT: constant(decimal) = 50000000.0

# Notes:
# 1. All incoming uint256 variables are scaled by 18 decimal places. These need to be scalled back to 8, by diving by 1e10.
# 2. All decimal variables scaled by 8 decimal places, for a total precision of 18 decimal points

@public
@constant
# @dev            Calculates the definite integral of the curve
# @param _x_t     token value for upper limit of definite integral
def curveIntegral(_x_t: uint256) -> uint256:
   # Convert scaled uint256 values from Solidity to decimal point values
    x_t: decimal = convert(_x_t, decimal)/SCALE_10

    # Only int128 & uint256 support exponentiation (a**b)
    uint_sqr: uint256 = convert(x_t, uint256)**2
    sqr: decimal = convert(uint_sqr, decimal)/SCALE_8

    # Calculate result and return scaled uint
    result: decimal = (sqr*GRADIENT)/(2.0*SCALE_8) + (VERTICAL_SHIFT*x_t)/SCALE_8
    return convert(result*SCALE_10, uint256)

@public
@constant
# @dev             Calculates the definite inverse integral of the curve
# @param _x_c      collateral value for upper limit of definite integral
def inverseCurveIntegral(_x_c: uint256) -> uint256:
    # Convert scaled uint256 values from Solidity to decimal point values
    x_c: decimal = convert(_x_c, decimal)/SCALE_10

    # Only int128 & uint256 support exponentiation (a**b)
    uint_sqr: uint256 = convert(VERTICAL_SHIFT, uint256)**2
    sqr: decimal = convert(uint_sqr, decimal)/SCALE_8

    # The sqrt() function only supports decimal type
    arg: decimal = sqr + (2.0*GRADIENT*x_c)/SCALE_8
    sqrt_arg: decimal = sqrt(arg)*sqrt(SCALE_8)

    # Calculate result and return scaled uint
    result: decimal = (-VERTICAL_SHIFT + sqrt_arg)/GRADIENT*SCALE_8
    return convert(result*SCALE_10, uint256)


