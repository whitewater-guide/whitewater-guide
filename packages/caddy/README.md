# Container-specific env vars

| Variable name               | Value examples (defaults)                                   | Description                        
|-----------------------------|-------------------------------------------------------------|------------------------------------
| CADDY_ADDRESS               | https://whitewater.guide (prod), http://0.0.0.0:2015 (dev)  | Server address to use Caddyfile  
| CADDYPATH                   | /etc/caddycerts                                             | Directory where to store ssl certificates obtained by caddy. Should me bind-mounted 
| CADDY_CACHE_PATH            | /tmp/caddy-cache                                            | Directory (inside container) where caddy will store its cache. Should be tmpfs or volume 
| CADDY_TLS_EMAIL             | K.Kuznetcov@gmail.com                                       | Email to be sent to letsencrypt for certificate 