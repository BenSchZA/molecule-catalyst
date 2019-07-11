FROM nginx:1.15.12-alpine

COPY --from=registry.gitlab.com/linumlabs/molecule-sandbox/build/builder:latest /build/WebApp/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY --from=registry.gitlab.com/linumlabs/molecule-sandbox/build/builder:latest /build/WebApp/build .

EXPOSE 80
