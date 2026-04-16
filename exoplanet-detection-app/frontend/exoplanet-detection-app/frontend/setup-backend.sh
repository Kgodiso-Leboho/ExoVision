#!/bin/bash
echo "Setting up ExoVision Backend..."

cd backend
echo "Creating virtual environment..."
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Creating data directory..."
mkdir -p data

echo "Backend setup complete!"
echo "To start the backend:"
echo "cd backend"
echo "source venv/bin/activate"
echo "uvicorn app.main:app --reload --port 8000"