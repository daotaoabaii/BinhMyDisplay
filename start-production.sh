#!/bin/bash

# Production Start Script
# Usage: ./start-production.sh

set -e

echo "==========================================";
echo "  🚀 Starting Production Environment";
echo "==========================================";

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}✗ .env file not found!${NC}";
    echo "  Please create .env file first:";
    echo "  cp .env.example .env";
    exit 1;
fi

echo -e "${GREEN}✓ .env file found${NC}";

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not installed${NC}";
    exit 1;
fi

echo -e "${GREEN}✓ Docker is installed${NC}";

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose not installed${NC}";
    exit 1;
fi

echo -e "${GREEN}✓ Docker Compose is installed${NC}";

echo "";
echo "==========================================";
echo "  🔨 Building Images";
echo "==========================================";

docker-compose build

echo "";
echo "==========================================";
echo "  ✨ Starting Services";
echo "==========================================";

docker-compose up -d

echo "";
echo "==========================================";
echo "  🔍 Checking Services Status";
echo "==========================================";

sleep 5

# Function to check service status
check_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose exec -T $service curl -s http://localhost:$port/health > /dev/null 2>&1; then
            echo -e "${GREEN}✓ $service is healthy${NC}";
            return 0
        fi
        echo "  Waiting for $service... (attempt $attempt/$max_attempts)";
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}✗ $service failed to start${NC}";
    return 1
}

echo "";
echo "Checking MongoDB...";
docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1 && echo -e "${GREEN}✓ MongoDB is running${NC}" || echo -e "${RED}✗ MongoDB is not responding${NC}";

echo "";
echo "Checking Backend Server...";
check_service server 3000

echo "";
echo "Checking Frontend...";
# Frontend uses nginx, so check if container is running
if docker-compose ps frontend | grep -q "Up"; then
    echo -e "${GREEN}✓ Frontend is running${NC}";
else
    echo -e "${RED}✗ Frontend is not running${NC}";
fi

echo "";
echo "==========================================";
echo "  📊 Services Status";
echo "==========================================";

docker-compose ps

echo "";
echo "==========================================";
echo "  📱 Application URLs";
echo "==========================================";

echo "";
echo -e "${YELLOW}Frontend:${NC}  http://localhost:3001";
echo -e "${YELLOW}Backend:${NC}   http://localhost:3000";
echo -e "${YELLOW}API:${NC}       http://localhost:3000/api/images";
echo -e "${YELLOW}Health:${NC}    http://localhost:3000/health";
echo "";

echo "==========================================";
echo "  📝 Useful Commands";
echo "==========================================";

echo "";
echo "View logs:";
echo "  docker-compose logs -f";
echo "";
echo "View backend logs:";
echo "  docker-compose logs -f server";
echo "";
echo "Stop services:";
echo "  docker-compose stop";
echo "";
echo "Restart services:";
echo "  docker-compose restart";
echo "";
echo "Remove everything:";
echo "  docker-compose down";
echo "";
echo "==========================================";
echo -e "${GREEN}✓ Production environment is ready!${NC}";
echo "==========================================";
echo "";

exit 0;
