#!/bin/bash

# This script is used to import the database from a file

source ../.env

CONTAINER_ID=$(docker ps -qf "name=postgresDB")
cat db_dump.sql | docker exec -i $CONTAINER_ID psql -U $POSTGRES_USERNAME -d $POSTGRES_NAME
