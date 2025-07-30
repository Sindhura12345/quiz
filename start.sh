#!/bin/bash

echo "🛡️  VulnGuard - Vulnerability Management Dashboard"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
    echo ""
fi

# Check if environment file exists
if [ ! -f "server/.env" ]; then
    echo "⚠️  Environment file not found. Creating from template..."
    cp server/.env.example server/.env
    echo "📝 Please edit server/.env with your API credentials:"
    echo "   - TENABLE_ACCESS_KEY"
    echo "   - TENABLE_SECRET_KEY"
    echo "   - MANAGE_ENGINE_API_KEY"
    echo "   - MANAGE_ENGINE_BASE_URL"
    echo ""
    echo "Then run this script again to start the dashboard."
    exit 0
fi

echo "🚀 Starting VulnGuard Dashboard..."
echo ""
echo "📊 Dashboard will be available at: http://localhost:3000"
echo "🔌 API server will be running at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start the application
npm run dev