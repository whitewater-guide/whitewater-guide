#!/usr/bin/env bash

echo "Initializing ${NODE_ENV} containers"

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

