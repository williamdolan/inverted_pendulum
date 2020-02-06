#!/usr/bin/env bash

docker pull eclipse-mosquitto
docker run -it -p 1883:1883 -d --network=mynet --network-alias=mqtt eclipse-mosquitto
