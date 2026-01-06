#!/bin/sh

# Initialize database (migrate and seed)
echo "Initializing database..."
node src/database/migrate.js
node src/database/seed.js

# Start the application
echo "Starting application..."
npm start
