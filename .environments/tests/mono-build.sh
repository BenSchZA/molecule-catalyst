#!/usr/bin/env nix-shell
#!nix-shell .environments/derivation_shell.nix/shell.drv -i bash
set -o errexit -o nounset -o pipefail

yarn
yarn build
