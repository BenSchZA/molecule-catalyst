# Molecule Protocol Contracts

To use this package, import the specific contract as follows:

```
import { IMarket } from "@molecule-protocol/contracts";
console.log(IMarket.abi);
```

You'll then have access to the ABI, bytecode, etc.

Or alternatively import all:

```
import * as contracts from "@molecule-protocol/contracts";
console.log(contracts.IMarket);
```