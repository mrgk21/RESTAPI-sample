FROM --platform=linux/arm64/v8 nginx:latest

WORKDIR /nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir /etc/nginx/ssl
COPY ./ssl /etc/nginx/ssl
RUN ls /etc/nginx
RUN ls /etc/nginx/ssl
COPY ./sites-enabled/backend.conf /etc/nginx/sites-enabled/