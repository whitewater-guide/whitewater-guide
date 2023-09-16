#! /bin/bash

# Download data for timezones migration
# Skip in production because it should be just copied from previous stage
if [[ "$NODE_ENV" != "production" && ! -f ./src/migrations/042/combined-with-oceans.json ]]; then
    echo "Downloading timezones geojson"
    curl -L "https://github.com/evansiroky/timezone-boundary-builder/releases/download/2020d/timezones-with-oceans.geojson.zip" -o ./src/migrations/042/timezones-with-oceans.geojson.zip
	unzip -o ./src/migrations/042/timezones-with-oceans.geojson.zip -d ./src/migrations/042/
	rm ./src/migrations/042/timezones-with-oceans.geojson.zip
fi
