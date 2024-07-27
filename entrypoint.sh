#!/bin/sh

yarn prisma generate

DB_PATH="/app/prisma/data.db"

if [ ! -f "$DB_PATH" ]; then
    echo "Database file not found, creating..."
    yarn prisma db push
fi

exec "$@"