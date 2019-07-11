# Use LTS Node environment as build environment
FROM registry.gitlab.com/linumlabs/molecule-sandbox/build/core:latest

# Initialize working directory
RUN mkdir -p /app
WORKDIR /app

# COPY --from=builder:latest /build/ApiServer/dist .
COPY --from=registry.gitlab.com/linumlabs/molecule-sandbox/build/builder:latest /build/ApiServer/package.json .
COPY --from=registry.gitlab.com/linumlabs/molecule-sandbox/build/builder:latest /build/ApiServer/src src
COPY --from=registry.gitlab.com/linumlabs/molecule-sandbox/build/builder:latest /build/ApiServer/node_modules node_modules
COPY --from=registry.gitlab.com/linumlabs/molecule-sandbox/build/builder:latest /build/ApiServer/tsconfig.json .
COPY --from=registry.gitlab.com/linumlabs/molecule-sandbox/build/builder:latest /build/ApiServer/tsconfig.spec.json .

# Serve application
ENTRYPOINT ["yarn", "start"]
EXPOSE 3001