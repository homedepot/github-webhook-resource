FROM node:16-alpine
WORKDIR /opt/resource
ADD bin .
ADD bin/out.js out
ADD package.json .

RUN NODE_ENV=production npm install --quiet
RUN apk update \
  && apk add jq \
  && rm -rf /var/cache/apk/*
