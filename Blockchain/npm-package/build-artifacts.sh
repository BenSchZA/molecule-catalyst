#!/bin/sh
set -o errexit -o nounset -o pipefail

# This is necessary because of the way Etherlime compiles the Vyper contracts, and relative directories
cp -r ../contracts temp
etherlime compile --workingDirectory=temp --buildDirectory=artifacts
rm -rf temp
