# Env variables

Only variables shared between containers are listed here.  
For container-specific env variables see packages READMEs

| Variable name               | Value examples (defaults)     | Description                        |
|-----------------------------|---------------------|------------------------------------|
| APP_DOMAIN                  | whitewater.guide (prod), localhost:6001 (dev) | Application domain. Used in backend to substitute minio internal urls with external urls    |
| PROTOCOL                    | https | Used in backend together with APP_DOMAIN to generate external image urls |
| POSTGRES_DB                 | wwguide | Postgres database name |
| PGPASSWORD                  | ******** | Postgres password |
| NODE_ENV                    | production | node env lol |
| MINIO_HOST                  | minio | Minio host name in docker internal network |
| MINIO_ACCESS_KEY            | <random_secret> | Minio access key |
| MINIO_SECRET_KEY            | <random_secret> | Minio secret key |
| MINIO_PROXY_PATH            | uploads | APP_DOMAIN path that will be proxied to minio by caddy |
| IMGPROXY_KEY                | <random_secret> | Imgproxy key | 
| IMGPROXY_SALT               | <random_secret> | Imgproxy salt |
| IMGPROXY_PATH               | images          | APP_DOMAIN that will be proxied to imgproxy by caddy |
| IMGPROXY_HOST               | imgproxy        | imgproxy host name inside docker internal network |
| IMGPROXY_TTL                | 86400           | Time to live for images resized by imgproxy |
| WORKERS_HOST                | workers         | Host name in docker network, or localhost for testing
| WORKERS_PORT                | 7080            | port on which workers container is listening (see workers README for more)
| WORKERS_ENDPOINT            | /endpoint       | endpoint on which workers container is listening (see workers README for more)
| WORKERS_LOG_LEVEL           | `debug`/`info`/`warning`/`error`/`fatal`       | log level for workers container, defaults to `debug`
| WORKERS_LOG_JSON            | false           | if set to true, workers container logs in json
