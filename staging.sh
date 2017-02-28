#!/usr/bin/env bash

echo "Initializing staging containers"

# Step 1
# Clean build dir
rm -rf build/*

# Step 2.
# Build backend (meteor) js bundle
cd backend
yarn run build
cd ../
echo "Bundled meteor backend"

# Step 3.
# Build web-client with webpack
cd web-client
yarn run build
cd ../
mkdir -p build/bundle/public/
mv web-client/build/* build/bundle/public/
mkdir tmp/
tar -C build -czf tmp/bundle.tar.gz bundle
rm -rf build
mv tmp/ build/
echo "Bundled web-client"

# Step 4
# Check if mongo service is running
docker-compose -f staging.yml exec mongo echo 'Is mongo alive?'
if [ $? -eq 0 ]; then
    echo "Mongo service is running, recreating passenger..."
    docker-compose -f staging.yml up -d --build --no-deps --force-recreate passenger
else
    echo "Mongo service is not running, launching everything"
    docker-compose -f staging.yml up -d --build --force-recreate
fi
