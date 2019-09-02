#!/usr/bin/env nix-shell
#!nix-shell -i bash -p rename
set -o errexit -o nounset -o pipefail

# This is necessary because of the way Etherlime compiles the Vyper contracts, and relative directories
cp -r ../contracts temp
etherlime compile --workingDirectory=temp --buildDirectory=artifacts --exportAbi
rm ./artifacts/*.json
mv ./artifacts/abis/*.json ./artifacts
rm -rf ./artifacts/abis
rename "s/-abi//" ./artifacts/*.json
rm -rf temp
