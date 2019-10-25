#!/usr/bin/env nix-shell
#!nix-shell .environments/derivation_shell.nix/shell.drv -i bash
set -o errexit -o nounset -o pipefail

# TODO:
# 1. configure image pull secrets in namespace
# imagePullSecrets:
#   - name: gitlab-registry
# 2. configure Route53 records below
# 3. configure environment variables - the `nounset` option means this script will fail if they aren't set
DATE=\"$(date +'%s')\"

# HERE BE DRAGONS! Careful what you change here. With great power comes great responsibility.
deploy_namespace() {
  NAMESPACE=$1

  cat <<EOF > deployment.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: env-config
  namespace: $NAMESPACE
data:
  APP_NAME: "molecule_API_server"
  APP_SCHEMA: "https"
  APP_HOST: "0.0.0.0"
  APP_PORT: "3001"
  APP_ROUTE_PREFIX: "/api"
  APP_BANNER: "true"
  LOG_LEVEL: "debug"
  LOG_OUTPUT: "dev"
  MONGO_USERNAME: "mongo-user"
  MONGO_HOST: "mongo-molecule.$NAMESPACE"
  MONGO_PORT: "27017"
  MONGO_DATABASE: "molecule-catalyst-$NAMESPACE-$NPM_CONTRACTS_VERSION"
  MONGO_AUTH_SOURCE: "admin"
  BCRYPT_SALT_ROUND: "10"
  JWT_EXPIRY: "1"
  ETHERS_PROVIDER: "default"
  ETHERS_NETWORK: "rinkeby"
  ETHERS_RPC_PROVIDER_URL: "http://localhost:8545"
  WEB_APP_URL: "https://alpha-$TAG.mol.ai"
  DAI_CONTRACT_ADDRESS: $DAI_CONTRACT_ADDRESS
  MARKET_REGISTRY_ADDRESS: $MARKET_REGISTRY_ADDRESS
  MARKET_FACTORY_ADDRESS: $MARKET_FACTORY_ADDRESS
---
# Frontend Deployment (Pod)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: molecule-frontend
  namespace: $NAMESPACE
  labels:
    app: molecule-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: molecule-frontend
  
  # Pod template
  template:
    metadata:
      labels:
        app: molecule-frontend
        date: $DATE
    spec:
      containers:
        - name: $TAG
          image: $REGISTRY/linumlabs/molecule-alpha/release/molecule-frontend:$TAG
          imagePullPolicy: Always
          ports:
            - containerPort: 80
      imagePullSecrets:
        - name: gitlab-registry-molecule
---
# Frontend Service
apiVersion: v1
kind: Service
metadata:
  name: molecule-frontend
  namespace: $NAMESPACE
  labels:
    app: molecule-frontend
    date: $DATE
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      protocol: TCP
  selector:
    app: molecule-frontend
---
# Backend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: molecule-backend 
  namespace: $NAMESPACE
  labels:
    app: molecule-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: molecule-backend

  # Pod template
  template:
    metadata:
      labels:
        app: molecule-backend
        date: $DATE
    spec:
      containers:
        - name: $TAG
          image: $REGISTRY/linumlabs/molecule-alpha/release/molecule-backend:$TAG
          imagePullPolicy: Always
          ports:
            - containerPort: 3001
          envFrom:
          - configMapRef:
              name: env-config
          - secretRef:
              name: env-secrets
      imagePullSecrets:
        - name: gitlab-registry-molecule
---
# Backend Service
apiVersion: v1
kind: Service
metadata:
  name: molecule-backend
  namespace: $NAMESPACE
  labels:
    app: molecule-backend
    date: $DATE
spec:
  type: NodePort
  ports:
    - port: 3001
      targetPort: 3001
      protocol: TCP
  selector:
    app: molecule-backend
EOF

  kubectl apply -f deployment.yaml --namespace="$NAMESPACE"
}

deploy() {
  TAG=$BRANCH_NAME

  if [ $TAG == "nightly" ]
  then
    echo "Configuring env variables"
    NPM_CONTRACTS_VERSION=0_0_13 # Contract NPM package version
    DAI_CONTRACT_ADDRESS=0xDC3c52266AA4102De49B14c6bD25B495Acb88619
    MARKET_REGISTRY_ADDRESS=0xD4D33CE814041F2b777C2726529cdf3F14846B06
    MARKET_FACTORY_ADDRESS=0x3D5fbfd16104502104581a44DEe4faE2caDc6595
  # elif [ $TAG == "staging" ]
  # then
  else
    echo "Invalid tag for frontend host"
    exit 1
  fi

  NAMESPACE=$PROJECT_NAME-$BRANCH_NAME

  deploy_namespace $NAMESPACE
}

if [ $BRANCH_NAME == "nightly" ]
then
  deploy
# elif [ $BRANCH_NAME == "staging" ]
# then
#   deploy
else
  echo "Invalid deployment branch"
  exit 1
fi
