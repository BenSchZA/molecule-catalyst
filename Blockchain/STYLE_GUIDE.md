# Style guide

## Index
[Naming conventions](#naming-convention)
[Documentation formatting]()
[Function layout]()

# Naming convention

## Contract variables names

The naming convention for variables and functions.

### Private/internal variables

To indicate that a contract (storage) variable is private/internal, add an underscore to the end of the name. This is to prevent the accidental use of storage variables.
```
variableName_
```

### Public/external 

To indicate that a variable is public, nothing is done.
```
variableName
```

### Parameters

To indicate that a variable is a parameter (memory) add an underscore to the beginning of the variable.
```
_variableName
```

## Contract functions

### Private/internal 

To indicate that a function is private/internal add an underscore to the beginning of the function. This is to ensure that function is not called unintentionally.
```
_functionName()
```

### Public/external

To indicate that a function is public, continue as normal.
```
functionName()
```

# Documentation formatting 
TODO

# Function Layout

If the function can fit on one 80 char line then the function can be written over one line.

If the function is longer than one 80 character line, then the function must be split up as follows

```
function funcName(
    uint256 _aNumber,
    uint8 _aSmolNumber,
    address _anAddress,
    address _anotherAddress
    ...
)
    external/public/internal/private
    modifiers()
    returns(uint256)
{
    ...
}
```

If there are multiple returning variables, they too must be split over multiple lines like so

```
function funcName(
    uint256 _aNumber,
    uint8 _aSmolNumber,
    address _anAddress,
    address _anotherAddress
    ...
)
    external/public/internal/private
    modifiers()
    returns(
        uint256,
        address,
        address
    )
{
    ...
}
```
