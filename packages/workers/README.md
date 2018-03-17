# Workers

Each worker can be compiled to binary, so you can play with it from command line and see the results in human-friendly format.
See corresponding top-level go files, e.g. `norway.go`. Command-line help provided, thanks to `cobra`


Main file is (surprise) `main.go`, it is simple http server.
 
## Env variables

Name                   | Default value | Desription                        
-----------------------|---------------|-----------------------------------
WORKERS_PORT           | 7080          | Port to listen on
WORKERS_ENDPOINT       | `/endpoint`   | Path where to accept requests
 
So most likely you should send your requests to `http://workers:7080/endpoint`

## Requests

Endpoint accepts `application/json` `POST` requests with following fields:

Name           | Values                                               | Description
---------------|------------------------------------------------------|-------------
command        | One of: `list`, `autofill`, `harvest`                | What script should do
script         | Script name, required for everything but `list`      | Get valid script names by sending `list` first
code           | Gauge code, string                                   | Required for `harvest` for one-by-one gauges
since          | UNIX timestamp to filter out old measurements        | Optional
extras         | `map[string]interface{}`                             | Optional, passed to `harvest` implementations, e.g. `{version: 2, html: true}` for `norway`

## Responses

### Error

Will return `400` without body for incorrect request  
Will `200` and error body in case of workers failures

`{success: false, error: <error string>}`

### Success

`{success: true, data: Array<AutofillResult|HarvestResult|ListResult>}`

#### List result

Name           | Values                                               | Description
---------------|------------------------------------------------------|-------------
name           | string                                               | Script name, argument to further `autofill` or `harvest`
mode           | `allAtOnce` or `oneByOne`                            | Script harvest mode, used for scheduling

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

#### Harvest result

Name           | Values                         | Description
---------------|--------------------------------|-------------
script         | string                         | Script name
code           | string                         | Gauge code
timestamp      | timestamp in UTC as string     | E.g. `2018-03-17T10:21Z`
level          | float                          | 0 if not measured
flow           | float                          | 0 if not measured
