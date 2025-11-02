#!/bin/bash

# HealthcareAI Development Startup Script
echo "🏥 Starting HealthcareAI Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if MongoDB is running (optional - can use cloud MongoDB)
if command -v mongod &> /dev/null; then
    if ! pgrep -x "mongod" > /dev/null; then
        echo "⚠️  MongoDB is not running. Starting MongoDB..."
        mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db
    fi
fi

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend Server..."
    cd backend
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo "📝 Creating backend .env file..."
        cp .env.example .env
        echo "⚠️  Please update backend/.env with your configuration"
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        npm install
    fi
    
    # Start backend in development mode
    npm run dev &
    BACKEND_PID=$!
    echo "✅ Backend started on http://localhost:5000 (PID: $BACKEND_PID)"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend Server..."
    cd frontend
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        echo "📝 Creating frontend .env.local file..."
        cp .env.local.example .env.local
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend in development mode
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)"
    cd ..
}

# Start both servers
start_backend
sleep 3  # Give backend time to start
start_frontend

echo ""
echo "🚀 HealthcareAI Development Environment is ready!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:5000"
echo "📍 API Docs: http://localhost:5000/api/health"
echo ""
echo "Demo Credentials:"
echo "👨‍💼 Admin:   admin@healthcare.ai / password123"
echo "👨‍⚕️ Doctor:  doctor@healthcare.ai / password123"
echo "👤 Patient: patient@healthcare.ai / password123"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ All servers stopped"; exit 0' INT

# Keep script running
wait
