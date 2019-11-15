<div align="center">
    <img src="../x-imgs/mol_cat_logo.png">
    <h3>Molecule Catalyst is an open source crowdfunding platform for medical research and development</h3>
</div>

---

# Style guide

# Index
#### [Naming conventions](#naming-convention)
* [Contract variables names](#contract-variables-names)
    * [Private & internal variables](#private-internal-variables)
    * [Public & external variables](#public-external-variables)
    * [Function parameters](#function-parameters)
* [Contract functions](#contract-functions)
    * [Private & internal functions](#private-internal-functions)
    * [Public & external functions](#public-external-functions)
#### [Documentation formatting](#documentation-formatting)
* [State variables](#state-variables)
* [Contract and functions](#contract-and-functions)
#### [Function layout](#function-layout)

#### [> To Contract Interfaces & Events](./ContractInterfaces&Events.md)
#### [> To Generated Docs](./GeneratedDocsIndex.md)
#### [< Back to `README`](../README.md)

---

# Naming convention

A guide to the nameing contention of Molecule Smart Contracts.
Excluding [Openzepplin utils and access](../node_modules/openzeppelin-solidity/README.md).

---

## Contract variables names

The naming convention for variables and functions.

### Private & internal variables

To indicate that a contract (storage) variable is private/internal, add an underscore to the end of the name. This is to prevent the accidental use of storage variables.
```
variableName_

// i.e
uint256 internal poolBalance_;
```

### Public & external variables

To indicate that a variable is public, nothing is done.
```
variableName

// i.e
uint256 external variableName;
```

### Function parameters

To indicate that a variable is a parameter (memory) add an underscore to the beginning of the variable.
```
_variableName

// i.e
function balanceOf(address _owner) public {
    ...
}
```

## Contract functions

### Private & internal functions

To indicate that a function is private/internal add an underscore to the beginning of the function. This is to ensure that function is not called unintentionally.
```
_functionName()

// i.e
function _mint() {
    ...
}
```

### Public & external functions

To indicate that a function is public, continue as normal.
```
functionName()

// i.e
function mint() {
    ...
}
```

# Documentation formatting 

## State variables
All state variables are documented for ease of understanding. A one line description is added above the declaration with a `//`.

```
// The total amount of collateral held by the contract
uint256 internal _poolBalance;
```

## Contract and functions

For the Molecule Alpha contracts NatSpec docs are used. The `/** */` is used over `///`.
Tags are listed in the following order:

```
/**
  * @title  Describes the contract or interface (contract, interface)
  * @author The GitLab tag of the author(s) (contract, interface, function)
  * @notice Explains to an end user what it does (contract, interface, function)
  * @dev    Explain to a developer any extra details (contract, interface, 
  *         function)
  * @param  Describes a parameter. Followed by the parameter name as it appears
  *         in the function signature. Each parameter gets its own tag. 
  *         (function)
  * @return Describes a return. Followed by the return type. If there are
  *         multiple returns they each get their own tag. (function)
  */
```

Contract declarations have the following tags:

```
/**
  * @author @veronicaLC
  * @title  Storage and collection of market tax.
  * @notice The vault stores the tax from the market until the funding goal is
  *         reached, thereafter the creator may withdraw the funds. If the
  *         funding is not reached within the stipulated time-frame, or the
  *         creator terminates the market, the funding is sent back to the
  *         market to be re-distributed.
  * @dev    The vault pulls the mol tax directly from the molecule vault.
  */
  contract Vault {
      ...
  }
```

Function declarations have the following tags:
The `@author` tag should only be added if the author of the function is different to the author of the contract.
The `@notice` and `@dev` functions should only be used if the functions purpose is not obvious on the first read.

```
/**
  * @param  _number : The amount of tokens
  * @param  _user : The address of the user spending tokens 
  * @return uint256 : The amount of tax the user is paying    
  * @return uint256 : The users new balance
  */
  function doesAThing(
        uint256 _number,
        address _user
    ) 
        public
        returns(uint256, uint256)
    {
        ...
    }
```

# Function layout

If the function can fit on one 80 char line then the function can be written over one line.

```
function funcName(uint256 _aNumber) external/public/internal/private {
    ...
}
```

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
