#!/bin/bash
# Build script for Railway deployment

echo "Installing dependencies..."
pip install -r emtech_backend/requirements.txt

echo "Collecting static files..."
cd emtech_backend
python manage.py collectstatic --noinput

echo "Running migrations..."
python manage.py migrate

echo "Build completed!" 