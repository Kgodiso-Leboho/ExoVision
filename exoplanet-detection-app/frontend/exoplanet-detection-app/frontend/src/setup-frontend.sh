#!/bin/bash
echo "Setting up ExoVision Frontend..."

cd frontend
echo "Installing dependencies..."
npm install react-router-dom

echo "Frontend setup complete!"
echo "To start the frontend:"
echo "cd frontend"
echo "npm run dev"