#!/bin/sh

echo "Start restore SQL DB"
psql -h $PGHOST -U $PGUSER -d $PGDATABASE < /workspace/SQL/init_structure.sql
psql -h $PGHOST -U $PGUSER -d $PGDATABASE < /workspace/SQL/init_example_values.sql

echo "Finished restore SQL DB"
