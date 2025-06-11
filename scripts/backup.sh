#!/bin/bash
set -e

BACKUP_DIR="/opt/r7l_backups"
TIMESTAMP=$(date +"%F_%H-%M-%S")

mkdir -p "$BACKUP_DIR"

docker exec r7l-postgres pg_dump -U r7l_admin r7l > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

tar czf "$BACKUP_DIR/resources_$TIMESTAMP.tar.gz" ./resources/docx ./resources/exercise_desc ./resources/exercises ./resources/Tests

ls -tp $BACKUP_DIR/db_backup_*.sql | grep -v '/$' | tail -n +8 | xargs -r rm --
ls -tp $BACKUP_DIR/resources_*.tar.gz | grep -v '/$' | tail -n +8 | xargs -r rm --