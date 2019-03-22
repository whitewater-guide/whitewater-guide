## dockerfile base: https://github.com/minio/minio/blob/master/Dockerfile.release
## https://gist.github.com/justbk/384f41766b787afda84d623c95f4ba10

FROM minio/minio:RELEASE.2019-03-20T22-38-47Z AS upstream

FROM alpine:3.7 AS miniobase

LABEL maintainer="Minio Inc <dev@minio.io>"

COPY --from=upstream /usr/bin/minio /usr/bin/docker-entrypoint.sh /usr/bin/healthcheck /usr/bin/

ENV MINIO_UPDATE off
ENV MINIO_ACCESS_KEY_FILE=access_key \
    MINIO_SECRET_KEY_FILE=secret_key

RUN echo 'hosts: files mdns4_minimal [NOTFOUND=return] dns mdns4' >> /etc/nsswitch.conf

EXPOSE 9000

ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]

#VOLUME ["/data"]

HEALTHCHECK --interval=1m CMD healthcheck

CMD ["minio"]

###########

## extend ours from the base image
FROM miniobase

## docker build arguments
#   https://vsupalov.com/docker-arg-env-variable-guide/
# active directory role account
ARG MINIO_USER
ARG MINIO_UID
ARG MINIO_GID

## customizations
# create user inside container to match our external active directory uid:gid
#  thanks for http://stackoverflow.com/a/1094354/535203 to compute the creation date
# prep our volume-to-be directory
RUN echo "${MINIO_USER}:x:${MINIO_UID}:${MINIO_GID}::/home/${MINIO_USER}:" >> /etc/passwd && \
    echo "${MINIO_USER}:!:$(($(date +%s) / 60 / 60 / 24)):0:99999:7:::" >> /etc/shadow && \
    echo "${MINIO_USER}:x:$MINIO_UID:" >> /etc/group && \
    mkdir -p /home/${MINIO_USER} && chown ${MINIO_USER}: /home/${MINIO_USER} && \
    mkdir -p /data && \
    chown -R ${MINIO_UID}:${MINIO_GID} /data

## do NOT do this volume mount within the Dockerfile -- we'll need to call it via cmdline to ensure permissions hold
#   https://medium.com/@bhadrajatin/docker-volume-mount-as-non-root-77ffae5a79d0
#   https://github.com/moby/moby/issues/2259
#VOLUME ["/data"]

## run minio as our role account :)
USER ${MINIO_USER}