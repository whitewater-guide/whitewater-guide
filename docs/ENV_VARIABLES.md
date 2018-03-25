# Env variables

## General principles

Each docker container has access to some environment variables (some of them should be replaced with docker-secrets in future).
These env variables are stored in `.env.*` files in root of `packages/<container_service_name>` directories.
Some containers share some variables (e.g. postgres password). Shared variables are stored in `.env.*` files in `build` dir.

Env filenames follow this patter `.env.<environment_name>`. 
Each file can be accompanied by `.env.<environment>.local` file, which contains local overrides.  

`.env.<environment_name>` files **are encrypted** with `git secret` and secrets **are checked in** into git.
The files themselves are **.gitignored**
  
`env.<environment_name>.local` files are **.gitignored** and should be only used on developers machines for local overrides.
They should never be stored in git. 

## Shared variables

Only variables shared between containers are listed here.  
For container-specific env variables see packages READMEs

| Variable name               | Value examples (defaults) | Consumers                  | Description                        |
|-----------------------------|---------------------------|----------------------------|------------------------------------|
| POSTGRES_DB                 | wwguide                   | backend, workers, db       | Postgres database name |
| POSTGRES_PASSWORD           | ********                  | backend, workers, db       | Postgres password |
| IMGPROXY_KEY                | <random_secret>           | backend, imgproxy          | Imgproxy key | 
| IMGPROXY_SALT               | <random_secret>           | backend, imgproxy          | Imgproxy salt |
| MINIO_ACCESS_KEY            | <random_secret>           | backend, minio             | Minio access key |
| MINIO_SECRET_KEY            | <random_secret>           | backend, minio             | Minio secret key |
| MINIO_PROXY_PATH            | uploads                   | backend, caddy             | APP_DOMAIN path that will be proxied to minio by caddy |
| IMGPROXY_PATH               | images                    | backend, caddy             | APP_DOMAIN that will be proxied to imgproxy by caddy |
| WORKERS_HOST                | workers                   | backend, workers           | Host name in docker network, or localhost for testing
| WORKERS_PORT                | 7080                      | backend, workers           | port on which workers container is listening (see workers README for more)
| WORKERS_ENDPOINT            | /endpoint                 | backend, workers           | endpoint on which workers container is listening (see workers README for more)
