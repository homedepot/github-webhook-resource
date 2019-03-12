FROM node:alpine
WORKDIR /opt/resource
COPY src/ .
COPY package.json .

RUN NODE_ENV=production npm install --quiet
RUN apk update \
 && apk add jq \
 && rm -rf /var/cache/apk/*
