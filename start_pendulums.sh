#!/usr/bin/env bash

docker network create mynet

echo "Starting mqtt broker"
./start_mqtt_broker.sh
sleep 5

echo "Starting pendulums"
./run_server.sh 8080
./run_server.sh 8081
./run_server.sh 8082
./run_server.sh 8083
./run_server.sh 8084

echo "Configuring pendulums"
curl -d "@config/config1.json" -H "Content-Type: application/json" http://localhost:8080/config
sleep 1
curl -d "@config/config2.json" -H "Content-Type: application/json" http://localhost:8081/config
sleep 1
curl -d "@config/config3.json" -H "Content-Type: application/json" http://localhost:8082/config
sleep 1
curl -d "@config/config4.json" -H "Content-Type: application/json" http://localhost:8083/config
sleep 1
curl -d "@config/config5.json" -H "Content-Type: application/json" http://localhost:8084/config

echo "Starting UI"
./run_ui.sh
