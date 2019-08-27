#!/usr/bin/env nix-shell
#!nix-shell .environments/derivation_shell.nix/shell.drv -i bash
set -o errexit -o nounset -o pipefail

git config --global push.default simple
git config --global user.email "${GITLAB_USER_EMAIL}"
git config --global user.name "${GITLAB_USER_NAME}"
git remote set-url origin https://BenSchZA:$PRIVATE_TOKEN@gitlab.com/$CI_PROJECT_PATH.git
git fetch
