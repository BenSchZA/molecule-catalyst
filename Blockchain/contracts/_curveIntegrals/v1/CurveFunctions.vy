# Configure decimal point precision and scaling
DECIMALS: constant(int128) = 18
SCALE: constant(decimal) = convert(10**DECIMALS, decimal)

SCALE_10: constant(decimal) = convert(10**10, decimal)
SCALE_8: constant(decimal) = convert(10**8, decimal)

# All decimal variables scaled by 8 decimal places, for a total precision of 18 decimal points
GRADIENT: constant(decimal) = 5714.2857142857 # 1/17500 NB! max 10 decimal places, we're overflowing
VERTICAL_SHIFT: constant(decimal) = 50000000.0
# All incoming uint256 variables are scaled by 18 decimal places. These need to be scalled back to 8, by diving by 1e10.

@public
@constant
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


