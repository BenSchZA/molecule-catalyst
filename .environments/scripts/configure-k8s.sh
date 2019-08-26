#!/usr/bin/env nix-shell
#!nix-shell .environments/derivation_shell.nix/shell.drv -i bash
set -o errexit -o nounset -o pipefail

kubectl config set-cluster $CLUSTER --server="$KUBE_URL" --certificate-authority="$KUBE_CA_PEM_FILE"
kubectl config set-credentials admin --token="$KUBE_TOKEN"
kubectl config set-context default --cluster="$CLUSTER" --user=admin
kubectl config use-context default
kubectl config get-contexts