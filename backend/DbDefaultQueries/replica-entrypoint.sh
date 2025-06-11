## Script to initialize a PostgreSQL replica container

#!/bin/bash
set -e

if [ ! -s "$PGDATA/PG_VERSION" ]; then
  echo "Cloning data from master..."
  pg_basebackup -h r7l-postgres -D "$PGDATA" -U $POSTGRES_USER -Fp -Xs -P -R
  chown -R postgres:postgres "$PGDATA"
fi