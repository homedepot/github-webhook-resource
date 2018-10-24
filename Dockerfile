FROM node
WORKDIR /opt/resource
ADD bin .
ADD package.json .

RUN npm install --quiet
RUN apt-get update && apt-get install -y jq
