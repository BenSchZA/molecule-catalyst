#!/usr/bin/env nix-shell
#!nix-shell .environments/derivation_shell.nix/shell.drv -i bash
set -o errexit -o nounset -o pipefail

docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN registry.gitlab.com \
    && apk add --no-cache py-pip \
    && pip install docker-compose