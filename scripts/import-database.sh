#!/bin/bash

source .env

CONTAINER_ID=$(docker ps -qf "name=postgresDB")

# Create a backup
docker exec -t $CONTAINER_ID pg_dump --data-only -U $POSTGRES_USERNAME -d $POSTGRES_NAME > backup.sql

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

# Import the data
cat db_data.sql | docker exec -i $CONTAINER_ID psql -U $POSTGRES_USERNAME -d $POSTGRES_NAME