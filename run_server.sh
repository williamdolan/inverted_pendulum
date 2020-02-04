#!/usr/bin/env bash

port=${1:-8080}
echo $port
docker build -t my-nodejs-app .
docker run -p $port:8080 -d my-nodejs-app
