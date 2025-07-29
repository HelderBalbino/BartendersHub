#!/bin/bash

# BartendersHub Backend - Render Deployment Helper Script
# This script helps prepare your backend for Render deployment

echo "🥃 BartendersHub Backend - Render Deployment Helper"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the backend directory."
    exit 1
fi

echo "✅ Found package.json"

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Run security audit
echo "🔒 Running security audit..."
npm audit

# Test the application
echo "🧪 Running tests..."
npm test

# Check environment variables
echo "🔧 Checking environment configuration..."
if [ ! -f ".env.example" ]; then
    echo "⚠️  Warning: .env.example not found"
else
    echo "✅ Found .env.example"
fi

# Create render.yaml if it doesn't exist
if [ ! -f "render.yaml" ]; then
    echo "📝 Creating render.yaml configuration..."
    cat > render.yaml << EOF
services:
  - type: web
    name: bartendershub-backend
    env: node
    plan: starter
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    autoDeploy: true
    healthCheckPath: /api/health
EOF
    echo "✅ Created render.yaml"
else
    echo "✅ Found render.yaml"
fi

echo ""
echo "🎉 Backend is ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Set up MongoDB Atlas"
echo "3. Configure Cloudinary"
echo "4. Create Render web service"
echo "5. Add environment variables"
echo ""
echo "📖 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions"
