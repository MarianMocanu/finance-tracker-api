#!/bin/bash

source .env

CONTAINER_ID=$(docker ps -qf "name=postgresDB")

if [ ! -f backup.sql ]; then
    echo "There is no backup file"
    exit 1
fi

# Truncate all tables
docker exec -i $CONTAINER_ID psql -U $POSTGRES_USERNAME -d $POSTGRES_NAME <<EOF
DO
\$do\$
DECLARE
   _tbl text;
BEGIN
   FOR _tbl  IN
      SELECT quote_ident(t.table_schema) || '.' || quote_ident(t.table_name)
      FROM   information_schema.tables t
      WHERE  t.table_schema NOT LIKE 'pg_%'
      AND    t.table_schema != 'information_schema'
      AND    t.table_type = 'BASE TABLE'
   LOOP
      EXECUTE 'TRUNCATE TABLE ' || _tbl || ' CASCADE';
   END LOOP;
END
\$do\$;
EOF

# Restore the data
cat backup.sql | docker exec -i $CONTAINER_ID psql -U $POSTGRES_USERNAME -d $POSTGRES_NAME