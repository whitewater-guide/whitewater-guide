# Workers

**Terms** worker and script are a bit mixed up. Basically, script is more like a name for a worker, and worker is implementation. For example, GRAPHQL schema uses term *script*.

Docker image container two binary files:
- `workers-server` (*entrypoint*) - simple http server, listens for HTTP POST request with JSON bodies, replies with status. 
- `workers-cli` - command-line executable for manual diagnostics. Bash (well, it's alpine, so `sh`) into container or just run `docker exec ww-workers workers-cli autofill galicia`.
Command-line help provided, thanks to `cobra`
 
## Env variables

Container makes use of following env variables:

Name                    | Default value | Desription                        
------------------------|---------------|-----------------------------------
WORKERS_PORT            | 7080          | Port to listen on
WORKERS_ENDPOINT        | /endpoint     | Path where to accept requests
WORKERS_LOG_LEVEL       | debug         | Log level string, the one that [logrus](https://github.com/sirupsen/logrus#level-logging) accepts
WORKERS_LOG_JSON        |               | If true, logs are printed as JSON
POSTGRES_HOST           |               | (**required**) Postgres connection details - host 
POSTGES_DB              |               | (**required**) Postgres connection details - database name
PGPASSWORD              |               | (**required**) Postgres connection details - password
REDIS_HOST              | redis         | Redis connection details - host
REDIS_PORT              | 6379          | Redis connection details - port
 
So most likely you should send your requests to `http://workers:7080/endpoint`

## Requests

Endpoint accepts `application/json` `POST` requests with following fields:

Name           | Values                                               | Description
---------------|------------------------------------------------------|-------------
command        | One of: `list`, `autofill`, `harvest`                | What script should do
script         | Script name, required for everything but `list`      | Get valid script names by sending `list` first
code           | Gauge code, string                                   | Required for `harvest` for one-by-one gauges
extras         | JSON                                                 | Optional, depends on script, passed to `harvest` implementations, see example below

Example request body:

```json
{
  "command": "harvest",
  "script": "norway",
  "code": "6.9",
  "extras": {
    "html": true
  }
}
```

## Responses

### Errors and successes

Status code `400` in case of bad request (wrong command, etc.)  
Status code `200` in case of workers failures. For example when upstream for worker start to send garbage and parser breaks.  
In both cases response body will contain string field `error`

#### Examples

Request

```json
{
  "command": "sabotage_workers"
}
```

Server responds with status code `400` and
```json
{
  "success": false,
  "error": "bad command: sabotage_workers"
}
```

Successful response has status code 200 and looks like this:
```json
{
  "success": true,
  "data": "<command-specific response>"
}
```

#### List result

Name           | Values                                               | Description
---------------|------------------------------------------------------|-------------
name           | string                                               | Script name, argument to further `autofill` or `harvest`
mode           | `allAtOnce` or `oneByOne`                            | Script harvest mode, used for scheduling

Example:

```json
{
  "success": true,
  "data": [
    {
       "name": "galicia",
       "mode": "allAtOnce"
    },
    {
       "name": "galicia2",
       "mode": "allAtOnce"
    }
  ]
}
```

#### Autofill result

Name           | Values                                                                 | Description
---------------|------------------------------------------------------------------------|-------------
script         | string                                                                 | Script name
code           | string                                                                 | Gauge code
name           | string                                                                 | Gauge name
url            | string                                                                 | URL for humans
levelUnit      | string                                                                 | Level unit, e.g. `m` or `inches`
flowUnit       | string                                                                 | Flow unit, e.g. `m3/s` or `cfs`
location       | {`latitude`: `float`, `longitude`: `float`, `altitude`: `float` }      | Gauge location, or zeroes if not found

Example:

```json
{
  "success": true,
  "data": [
    {
      "script": "georgia",
      "code": "3c598e973566b29359a3821cf3dceceb",
      "name": "Acharistskali - keda",
      "url": "http://meteo.gov.ge/index.php?l=2&pg=hd",
      "levelUnit": "cm",
      "flowUnit": "",
      "location": {
        "latitude": 0,
        "longitude": 0,
        "altitude": 0
      },
      "timestamp": "2018-03-20T18:44:22Z",
      "level": 112,
      "flow": 0
    },
    {
      "script": "georgia",
      "code": "e0ad9d83162aa1828936d5a7935b36da",
      "name": "Alazani - Shakriani",
      "url": "http://meteo.gov.ge/index.php?l=2&pg=hd",
      "levelUnit": "cm",
      "flowUnit": "",
      "location": {
        "latitude": 0,
        "longitude": 0,
        "altitude": 0
      },
      "timestamp": "2018-03-20T18:44:22Z",
      "level": 238,
      "flow": 0
    }
  ]
}
```

#### Harvest result

Data is number of harvested measurements. For example:

```json
{
    "success": true,
    "data": 20
}
```

## Harvested data

Workers will save all harvested measurements to postgres table `measurements` which should look like this:
```postgresql
create table measurements
(
  timestamp timestamp with time zone not null,
  script varchar(255) not null,
  code varchar(255) not null,
  flow real,
  level real
)
```

Workers will filter out measurements where both flow and level are 0

For each script, a hash of last values is stored in redis. Key of the hash is script name, fields are gauge codes and values are JSON strings.  
Example of stored value:

```json
{
  "script": "georgia",
  "code": "c0a99c5c07ad0ae1cdb64b9bfa8b312e",
  "timestamp": "2018-03-20T18:52:00Z",
  "level": 46,
  "flow": 0
}
```

Also, for each script (for all-at-once sources) or script/code pair (for one-by-one sources) a result of last harvest is stored in redis.  
In is either key (for one-by-one sources) or hash with codes as fields (for all-at-once sources). Values are JSON strings like this:

```json
{
  "count": 35,
  "success": true,
  "timestamp": "2018-03-20T18:50:00Z"
}
```
