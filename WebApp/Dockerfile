FROM nginx:1.15.12-alpine

COPY --from=540682145059.dkr.ecr.us-west-2.amazonaws.com/linumlabs/molecule-alpha/build/builder:latest /build/WebApp/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY --from=540682145059.dkr.ecr.us-west-2.amazonaws.com/linumlabs/molecule-alpha/build/builder:latest /build/WebApp/build .

EXPOSE 80
