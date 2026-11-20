#!/bin/sh

set -eu

: "${POSTGRES_USER:=postgres}"
: "${POSTGRES_DB:=transcendence}"

if [ -z "${POSTGRES_PASSWORD:-}" ]; then
    echo "ERROR: POSTGRES_PASSWORD is required"
    exit 1
fi

DATA_DIR="/var/lib/postgresql/data"

if [ ! -s "$DATA_DIR/PG_VERSION" ]; then
    echo "Initializing PostgreSQL..."

    initdb -D "$DATA_DIR" \
        --auth-local=trust \
        --auth-host=scram-sha-256

    cat >> "$DATA_DIR/pg_hba.conf" <<'EOF'
host    all    all    0.0.0.0/0    scram-sha-256
host    all    all    ::/0         scram-sha-256
EOF

    echo "listen_addresses = '*'" >> "$DATA_DIR/postgresql.conf"

    pg_ctl -D "$DATA_DIR" \
        -o "-h 0.0.0.0 -k /run/postgresql" \
        -w start

    psql -h /run/postgresql -U postgres \
        -v ON_ERROR_STOP=1 \
        -v db_user="$POSTGRES_USER" \
        -v db_password="$POSTGRES_PASSWORD" \
        -v db_name="$POSTGRES_DB" <<'EOSQL'
        ALTER ROLE :"db_user"
            WITH LOGIN SUPERUSER PASSWORD :'db_password';

        CREATE DATABASE :"db_name" OWNER :"db_user";
EOSQL

    pg_ctl -D "$DATA_DIR" -m fast -w stop

    echo "PostgreSQL initialization complete."
fi

exec postgres -D "$DATA_DIR"