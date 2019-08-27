# Use LTS Node environment as build environment
FROM 540682145059.dkr.ecr.us-west-2.amazonaws.com/linumlabs/molecule-alpha/build/core:latest

# Initialize working directory
RUN mkdir -p /app
WORKDIR /app

# COPY --from=builder:latest /build/ApiServer/dist .
COPY --from=540682145059.dkr.ecr.us-west-2.amazonaws.com/linumlabs/molecule-alpha/build/builder:latest \
  /build/ApiServer/package.json \
  /build/ApiServer/tsconfig.json \
  /build/ApiServer/tsconfig.spec.json \
  ./

COPY --from=540682145059.dkr.ecr.us-west-2.amazonaws.com/linumlabs/molecule-alpha/build/builder:latest \
  /build/ApiServer/src src
COPY --from=540682145059.dkr.ecr.us-west-2.amazonaws.com/linumlabs/molecule-alpha/build/builder:latest \
  /build/ApiServer/node_modules node_modules

# Serve application
ENTRYPOINT ["yarn", "start"]
EXPOSE 3001