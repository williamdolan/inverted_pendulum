#!/usr/bin/env bash

port=${1:-8079}
echo $port
docker build -t nodejs-ui -f Dockerfile.ui .
docker run -p $port:8080 -d nodejs-ui 
