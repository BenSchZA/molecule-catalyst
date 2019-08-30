# Naming convention

## Contract variables names

### Private/internal variables

To indicate that a contract (storage) variable is private/internal, add an underscore to the end of the name. This is to prevent the accidental use of storage variables.
`variableName_`

### Public/external 

To indicate that a variable is public, nothing is done.
`variableName`

### Parameters

To indicate that a variable is a parameter (memory) add an underscore to the beginning of the variable.
`_variableName`

## Contract functions

### Private/internal 

To indicate that a function is private/internal add an underscore to the beginning of the function. This is to ensure that function is not called unintentionally.
`_functionName()`

### Public/external

To indicate that a function is public, continue as normal.
`functionName()`