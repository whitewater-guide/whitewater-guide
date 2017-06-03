#!/usr/bin/env bash

exec > >(tee -i build/build.log)
exec 2>&1

# Step 1
# Clean build dir
rm -rf build/*

# Step 2.
# Build backend (meteor) js bundle in dedicated docker container
echo "----------- BUILDING METEOR BUNDLER IMAGE -------------"
docker build --force-rm -f ./.docker/meteor_bundler.docker --tag docker_bundler_image .
echo "----------- BUNDLING METEOR INSIDE DOCKER CONATINER -------------"
docker run --rm --volume `pwd`/build:/build docker_bundler_image
echo "----------- BUNDLING COMPLETE ------------"
docker rmi docker_bundler_image

# Step 3.
# Build web-client with webpack
echo "----------- BUNDLING CLIENT CODE ------------"
cd web-client
yarn run build
echo "----------- CLIENT CODE BUNDLED ------------"

# Step 4
# Compress client and server code into one archive
cd ../
mkdir -p build/bundle/public/
mv web-client/build/* build/bundle/public/
mkdir tmp/
echo "----------- COMPRESSING ------------"
tar -C build -czf tmp/bundle.tar.gz bundle
rm -rf build
mv tmp/ build/

echo "----------- DONE ------------"

