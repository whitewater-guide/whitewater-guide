FROM minio/minio:latest

COPY ./bin/seed_and_run.sh /usr/bin/
# RUN chmod +x /usr/bin/seed_and_run.sh
# ADD fake-data.tar.gz /tmp/

#ENTRYPOINT ["ls", "/usr/bin"]
ENTRYPOINT ["/usr/bin/seed_and_run.sh"]
