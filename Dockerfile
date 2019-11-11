# Use LTS Node environment as build environment
FROM 540682145059.dkr.ecr.us-west-2.amazonaws.com/linumlabs/molecule-alpha/build/core:latest

RUN mkdir -p /build/ApiServer
RUN mkdir -p /build/WebApp
RUN mkdir -p /build/WebApp/internals
RUN mkdir -p /build/Blockchain

WORKDIR /build

COPY package.json yarn.lock ./
COPY ApiServer/package.json ./ApiServer
COPY WebApp/package.json ./WebApp
COPY WebApp/internals ./WebApp/internals
COPY Blockchain/package.json ./Blockchain

RUN yarn install --frozen-lockfile && yarn cache clean
# --production

ADD . /build

ARG API_HOST
ARG API_SCHEMA

ARG APP_NAME
ARG APP_SCHEMA
ARG APP_HOST
ARG APP_PORT

ARG CHAIN_ID
ARG DAI_CONTRACT_ADDRESS
ARG MARKET_REGISTRY_ADDRESS
ARG MARKET_FACTORY_ADDRESS

ARG APM_SERVICE_NAME
ARG APM_SERVER_ENDPOINT
ARG APM_SECRET_TOKEN
ARG SENTRY_DSN

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV TOOL_NODE_FLAGS="--max-old-space-size=4096"

RUN yarn build:webapp

RUN rm -rf node_modules
RUN rm -rf Blockchain
RUN rm -rf WebApp/node_modules

CMD ["true"]
