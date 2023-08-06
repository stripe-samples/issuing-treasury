#!/bin/bash

# Ideally you should be able to use `npx prisma db push` to migrate your postgres database but if that fails for any
# reason due to permissions issues running locally, you can use this script to get started quickly.

DB_NAME="issuing_treasury"

# Check if the database exists
db_exists=$(psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$db_exists" != "1" ]; then
  # Create the database
  echo "Creating database..."
  psql -c "CREATE DATABASE $DB_NAME;"
else
  echo "Database already exists, skipping creation..."
fi

# Connect to the database and create the users table if it doesn't exist
echo "Creating users table..."
psql -d $DB_NAME -c "
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  account_id TEXT NOT NULL
);
"

echo "Setup complete!"
