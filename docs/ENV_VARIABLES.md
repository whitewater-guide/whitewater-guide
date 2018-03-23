# Env variables

Only variables shared between containers are listed here.  
For container-specific env variables see packages READMEs

| Variable name               | Value examples (defaults) | Consumers                  | Description                        |
|-----------------------------|---------------------------|----------------------------|------------------------------------|
| POSTGRES_DB                 | wwguide                   | backend, workers, db       | Postgres database name |
| PGPASSWORD                  | ********                  | backend, workers, db       | Postgres password |
| IMGPROXY_KEY                | <random_secret>           | backend, imgproxy          | Imgproxy key | 
| IMGPROXY_SALT               | <random_secret>           | backend, imgproxy          | Imgproxy salt |
| MINIO_ACCESS_KEY            | <random_secret>           | backend, minio             | Minio access key |
| MINIO_SECRET_KEY            | <random_secret>           | backend, minio             | Minio secret key |
| MINIO_PROXY_PATH            | uploads                   | backend, caddy             | APP_DOMAIN path that will be proxied to minio by caddy |
| IMGPROXY_PATH               | images                    | backend, caddy             | APP_DOMAIN that will be proxied to imgproxy by caddy |
| WORKERS_HOST                | workers                   | backend, workers           | Host name in docker network, or localhost for testing
| WORKERS_PORT                | 7080                      | backend, workers           | port on which workers container is listening (see workers README for more)
| WORKERS_ENDPOINT            | /endpoint                 | backend, workers           | endpoint on which workers container is listening (see workers README for more)
