# Molecule Protocol Contracts

## Building

To build the contracts, in the context of Molecule:

1. `yarn prePublish` - compiles contracts and copies output to `artifacts/` folder
2. `yarn compileIndex` - runs bash script to compile `index.js` static file exports
3. `yarn publish` - publishes package to NPM registry

## Installation and Use

To use this package, import the specific contract as follows:

```
import { IMarketRegistry } from "@molecule-protocol/catalyst-contracts";
console.log(IMarketRegistry.abi);
```

You'll then have access to the ABI, bytecode, etc.

Or alternatively import all:

```
import * as contracts from "@molecule-protocol/catalyst-contracts";
console.log(contracts.IMarketRegistry);
```

## Known Issues

1. WebPack `Can't resolve 'fs'` error

See https://github.com/webpack-contrib/css-loader/issues/447 for reference.

If you receive the following WebPack error:

```
ERROR in ./node_modules/require-all/index.js
Module not found: Error: Can't resolve 'fs' in '/home/LinumLabs/workspace/molecule-alpha/WebApp/node_modules/require-all'
```

the solutions is to add the following entry to your WebPack config:

```
node: {
    fs: 'empty',
  },
```

in the case of Molecule for example, this is found in the `WebApp/internals/webpack/webpack.base.babel.js` file.