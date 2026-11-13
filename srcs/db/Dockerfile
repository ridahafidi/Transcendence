
FROM alpine:3.24

RUN apk add --no-cache postgresql

COPY init-db.sh /usr/local/bin/init-db.sh

RUN chmod +x /usr/local/bin/init-db.sh \
    && mkdir -p /var/lib/postgresql/data /run/postgresql \
    && chown -R postgres:postgres /var/lib/postgresql /run/postgresql

USER postgres

EXPOSE 5432

ENTRYPOINT ["/usr/local/bin/init-db.sh"]
