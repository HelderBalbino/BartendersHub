#!/bin/bash

# BartendersHub Development Startup Script
echo "🥃 Starting BartendersHub Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${BLUE}Checking MongoDB status...${NC}"
if brew services list | grep -q "mongodb-community.*started"; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠️  Starting MongoDB...${NC}"
    brew services start mongodb-community
    sleep 2
fi

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
fi

echo -e "${GREEN}🚀 Ready to start development!${NC}"
echo -e "${BLUE}Run these commands in separate terminals:${NC}"
echo -e "${YELLOW}Terminal 1 (Backend):${NC} cd backend && npm run dev"
echo -e "${YELLOW}Terminal 2 (Frontend):${NC} npm run dev"
echo ""
echo -e "${GREEN}URLs:${NC}"
echo -e "Frontend: ${BLUE}http://localhost:5173${NC}"
echo -e "Backend:  ${BLUE}http://localhost:5000${NC}"
echo -e "MongoDB:  ${BLUE}mongodb://localhost:27017${NC}"
