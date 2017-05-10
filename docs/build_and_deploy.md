# Build and deploy

This document describes build and deploy process for backend and web-client

## General info

There are 3 configurations currently: development, staging and production

For development info, see `develop.md` file.

In production app run in docker containers. Currently there are 3 containers: 
- Passenger (basically, node + nginx tuned for meteor) with backend + web-client code in it
- MongoDB
- Backup service that uploads mongodump to s3 on schedule

Staging configuration is not for real staging server for now, it is intended to run in local docker and mimic production as close as possible.

Web-client is pure js app, it is build with webpack.

Backend is currently one-piece meteor app.

## Build process

**Important!** This process is for production only, for staging you cannot use `doomsower/whitewater_passenger_base` base image. Also staging compose file can be outdated.

Here is the build sequence:
- Bundle web-client using webpack
- Bundle backend using meteor's own build system
- Merge them into one archive, as it is easier to upload and chown later
- This three steps are automated in `build.sh` script
- Check if meteor version was changed, or some changes were made to `backend/settings.production.json`. 
  In this case, passenger base image `doomsower/whitewater_passenger_base` must be rebuilt, see next step.
- Use this command to build passenger base image:
    ```bash
    docker build --build-arg NODE_ENV=production -f ./.docker/base.docker -t whitewater_passenger .
    ```
    Tag and publish new version of this image in `doomsower/whitewater_passenger_base` like this:
    ```bash
    docker login
    docker tag whitewater_passenger doomsower/whitewater_passenger_base:1.2
    docker push doomsower/whitewater_passenger_base
    ```
    Update `passenger.docker` to use latest version of this image
## Deploy
- Login into remote docker-machine
- Build and run services as described in `production.yml` docker-compose file
- These steps are automated, just run `production.sh`
