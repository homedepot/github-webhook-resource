FROM node
WORKDIR /opt/resource
ADD bin .
ADD package.json .

RUN apt-get update & \
  npm install --quiet