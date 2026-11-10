FROM alpine:3.24

RUN apk update && apk add postgresql

RUN mkdir /run/postgresql && chown postgres:postgres /run/postgresql/

USER postgres

RUN mkdir /var/lib/postgresql/data && chmod 0700 /var/lib/postgresql/data

RUN initdb -D /var/lib/postgresql/data

RUN echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.con

RUN echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf

ENTRYPOINT postgres -D /var/lib/postgresql/data/
