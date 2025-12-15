#!/bin/bash

# Base directory
BASE_DIR="/Users/omarfilali/Desktop/projet_architecture"
MICROSERVICE_DIR="$BASE_DIR/projet_microservice"
FRONTEND_DIR="$BASE_DIR/smart-parking-frontend"

echo "Starting Smart Parking System..."

# Function to start a service in a new Terminal tab/window
start_service() {
    local service_dir=$1
    local service_name=$2
    local command=$3
    
    echo "Starting $service_name..."
    osascript -e "tell application \"Terminal\" to do script \"cd '$service_dir' && $command; exit\""
}

# 1. Start Discovery Service
start_service "$MICROSERVICE_DIR/discovery-service" "Discovery Service" "mvn spring-boot:run"

# Wait a bit for Discovery Service to initialize
echo "Waiting 10s for Discovery Service to initialize..."
sleep 10

# 2. Start Config/Gateway/Other Backend Services
start_service "$MICROSERVICE_DIR/gateway-service" "Gateway Service" "mvn spring-boot:run"
start_service "$MICROSERVICE_DIR/parking-service" "Parking Service" "mvn spring-boot:run"
start_service "$MICROSERVICE_DIR/reservation-service" "Reservation Service" "mvn spring-boot:run"
start_service "$MICROSERVICE_DIR/notification-service" "Notification Service" "mvn spring-boot:run"

# 3. Start Frontend
echo "Starting Frontend..."
start_service "$FRONTEND_DIR" "Frontend" "npm run dev"

echo "All services launched! Please check the opened Terminal windows."
echo "Eureka Dashboard: http://localhost:8761"
echo "Frontend: http://localhost:3000"
