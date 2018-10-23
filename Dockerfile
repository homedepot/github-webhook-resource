FROM node
ADD bin /opt/resource
ADD package.json /opt/resource

RUN apt-get update & \
  npm install --quiet