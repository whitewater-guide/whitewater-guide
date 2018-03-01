<!--
Are you asking for help with using Caddy? Please use our forum instead: https://caddy.community. If you are filing a bug report, please take a few minutes to carefully answer the following questions. If your issue is not a bug report, you do not need to use this template. Thanks!)
-->

### 1. What version of Caddy are you using (`caddy -version`)?
Caddy 0.10.11 

### 2. What are you trying to do?

I have a configuration with some static content and other uris proxied to different upstreams (graphql backend, minio storage and imgproxy which resizes images from minio). Now, I want to cache resized images that come from imgproxy upsteram.

### 3. What is your entire Caddyfile?
```text
{$CADDY_ADDRESS} {

  tls {$CADDY_TLS_EMAIL} {
    # The line below uses staging certificate
    # Comment it out to use real certificate
    ca https://acme-staging.api.letsencrypt.org/directory
  }

  root static

  index landing.html

  rewrite / {
    if {path} starts_with /graphql
    if {path} starts_with /graphiql
    if {path} starts_with /auth
    if {file} is schema.json
    if {file} is typedefs.txt
    if_op or
    to /backend{uri}
  }

  rewrite /ru {
    to {path} landing_ru.html
  }

  proxy /backend backend:3333 {
    without /backend
    transparent
  }

  proxy /{$MINIO_PROXY_PATH} {$MINIO_HOST}:9000 {
    transparent
  }

  proxy /{$IMGPROXY_PATH} {$IMGPROXY_HOST}:8080 {
    without /{$IMGPROXY_PATH}
    transparent
  }

  cache {
    match_path /${IMGPROXY_PATH}
    match_header Content-Type image/jpg image/png
    status_header X-Cache-Status
    default_max_age 24h
    path {$CADDY_CACHE_PATH}
  }

  log / stdout "{common} Upstream: {upstream}"

  errors stdout

}

```

### 4. How did you run Caddy (give the full command and describe the execution environment)?
Runs in docker, base image alpine:3.6
```
ENTRYPOINT ["/usr/bin/caddy"]
CMD ["--conf", "/etc/Caddyfile", "--log", "stdout"]
```

Env vars:
```sh
# printenv | grep -e CADDY -e IMGPROXY -e MINIO
IMGPROXY_TTL=86400
MINIO_ACCESS_KEY=*****
CADDYPATH=/etc/caddycerts
CADDY_ADDRESS=http://0.0.0.0:2015
IMGPROXY_PATH=images
MINIO_PROXY_PATH=uploads
IMGPROXY_SALT=****
IMGPROXY_KEY=****
MINIO_SECRET_KEY=****
IMGPROXY_HOST=imgproxy
MINIO_HOST=minio
CADDY_CACHE_PATH=/tmp/caddy-cache
CADDY_TLS_EMAIL=***
```

Caddy's 2015 port is exposed as 6001 on host machine, also backend's 3333 is exposed as 3333

### 5. Please paste any relevant HTTP request(s) here.

**Request 1**

```sh
curl -X GET \
  http://localhost:6001/graphiql \
  -H 'Cache-Control: no-cache' \
  -H 'Postman-Token: 8b54d505-38b2-08cb-c16c-4c7ee7b3e03d'
```

**Request 2**

```sh
curl -X GET \
  http://localhost:6001/backend/graphiql \
  -H 'Cache-Control: no-cache' \
  -H 'Postman-Token: a37f0839-390d-0ef6-0a2b-1447b179cbb9'
```

### 6. What did you expect to see?

`http://localhost:6001/graphiql` should correctly respond with 200 and (`http://localhost:6001/backend/graphiql` too, but it's unnecessary). It does so if I comment out `cache` block, so I expect to see same logs with or without `cache`:

```
ww-caddy    | 172.18.0.1 - - [28/Feb/2018:21:03:30 +0000] "GET /graphiql HTTP/1.1" 200 3817 Upstream: http://backend:3333
ww-caddy    | 172.18.0.1 - - [28/Feb/2018:21:03:36 +0000] "GET /backend/graphiql HTTP/1.1" 200 3817 Upstream: http://backend:3333
```

### 7. What did you see instead (give full error messages and/or log)?

When cache block is not commented, proxy/rewrite behave in a strange way. These are logs:
```
ww-caddy    | 172.18.0.1 - - [28/Feb/2018:21:02:39 +0000] "GET /graphiql HTTP/1.1" 404 28 Upstream: -
ww-caddy    | 172.18.0.1 - - [28/Feb/2018:21:02:46 +0000] "GET /backend/graphiql HTTP/1.1" 200 3817 Upstream: -
```

So `http://localhost:6001/graphiql` (rewrite to proxy) responds with 404. `http://localhost:6001/backend/graphiql` (proxy without rewrite) responds fine, but what interesting is that logs show `Upstream: -`

### 8. How can someone who is starting from scratch reproduce the bug as minimally as possible?

<!-- Please strip away any extra infrastructure such as containers, reverse proxies, upstream apps, caches, dependencies, etc, to prove this is a bug in Caddy and not an external misconfiguration. Your chances of getting this bug fixed go way up the easier it is to replicate. Thank you! -->
