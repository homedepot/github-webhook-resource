FROM node
WORKDIR /opt/resource
ADD bin .
ADD package.json .

RUN NODE_ENV=production npm install --quiet
RUN apt-get update && apt-get install -y jq
