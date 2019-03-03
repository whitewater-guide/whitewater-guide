# Container-specific env vars

| Variable name    | Value examples (defaults)                                         | Description                                                                              |
| ---------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ROOT_ADDRESS     | https://whitewater.guide (prod), http://0.0.0.0:2019 (dev)        | Top level address to use Caddyfile                                                       |
| API_ADDRESS      | https://api.whitewater.guide (prod), http://0.0.0.0:2015 (dev)    | Api address to use Caddyfile                                                             |
| MINIO_ADDRESS    | https://s3.whitewater.guide (prod), http://0.0.0.0:2016 (dev)     | Minio address to use Caddyfile                                                           |
| ADMINER_ADDRESS  | https://puzzle.whitewater.guide (prod), http://0.0.0.0:2017 (dev) | Adminer address to use Caddyfile                                                         |
| ADMIN_ADDRESS    | https://admin.whitewater.guide (prod), http://0.0.0.0:2018 (dev)  | Admin UI address to use Caddyfile                                                        |
| CADDYPATH        | /etc/caddycerts                                                   | Directory where to store ssl certificates obtained by caddy. Should me bind-mounted      |
| CADDY_CACHE_PATH | /var/caddy/cache                                                  | Directory (inside container) where caddy will store its cache. Should be tmpfs or volume |
| CADDY_TLS_EMAIL  | some@email.com (or `self_signed` for local env)                   | Email to be sent to letsencrypt for certificate                                          |
| ADMINER_USERNAME | username                                                          | Http auth user for adminer                                                               |
| ADMINER_PASSWORD | password                                                          | Http auth password for adminer                                                           |
