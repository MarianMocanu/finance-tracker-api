#!/bin/bash

# This script is used to dump the database to a file

source .env

CONTAINER_ID=$(docker ps -qf "name=postgresDB")
docker exec -t $CONTAINER_ID pg_dump --data-only -U $POSTGRES_USERNAME -d $POSTGRES_NAME >db_data.sql
