#!/usr/bin/env nix-shell
#!nix-shell ../shell.nix -i bash
set -o errexit -o nounset -o pipefail

yarn
yarn build
