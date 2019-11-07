#!/usr/bin/env nix-shell
#!nix-shell .environments/derivation_shell.nix/shell.drv -i bash
set -o errexit -o nounset -o pipefail

ensure_repo_exists() {
  for REPO_NAME in $1
  do
    aws ecr describe-repositories --repository-names $REPO_NAME --region $REGION || aws ecr create-repository --repository-name $REPO_NAME --region $REGION
  done
}

build_image() {
  $(aws ecr get-login --no-include-email --region $REGION)
  ensure_repo_exists "$FRONTEND_REPO_NAME $BACKEND_REPO_NAME"
  #docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN registry.gitlab.com
  docker-compose -v
  docker-compose build
  docker-compose up -d
  docker-compose down
  docker-compose push
}

build() {
  # Note: Docker requires that the env variables are specifically exported for some reason.
  # Option allexport doesn't work.
  export TAG=$BRANCH_NAME
  export REGION=us-west-2
  echo "Building $TAG Docker image"
  source .environments/variables/env_$BRANCH_NAME.sh # Load env variables for frontend build
  export FRONTEND_REPO_NAME=linumlabs/molecule-alpha/release/molecule-frontend
  export BACKEND_REPO_NAME=linumlabs/molecule-alpha/release/molecule-backend
  export MOLECULE_FRONTEND_CONTAINER_RELEASE_IMAGE=$REGISTRY/$FRONTEND_REPO_NAME:$TAG
  export MOLECULE_BACKEND_CONTAINER_RELEASE_IMAGE=$REGISTRY/$BACKEND_REPO_NAME:$TAG

  export API_HOST=alpha-api-$TAG.bitsofether.com
  #.mol.ai
  export APM_SERVICE_NAME=molecule-frontend-alpha-$TAG
  export APM_SERVER_ENDPOINT=https://apm.mol.ai
  
  build_image
}

if [ $BRANCH_NAME == "nightly" ]
then
  build
elif [ $BRANCH_NAME == "staging" ]
then
  build
else
  echo "Invalid deployment branch"
  exit 1
fi
