# whitewater.guide

## Requirements

Those things need to be installed

1. node.js 8.9+
2. ~~Docker for mac `17.09.1-ce-mac42` (21090). Newer versions do not work with docker-sync, see [docker-sync](https://github.com/EugenMayer/docker-sync/issues/517) and [d4m](https://github.com/docker/for-mac/issues/2417) bugs~~ 
3. ~~Docker-compose `1.19+`, because of [this bug](https://github.com/docker/compose/issues/5554)~~
4. Ignore, two previous points, just use latest docker for mac, `docker-sync` is temporary disabled because of bugs on above.  
5. [watchman](https://facebook.github.io/watchman/)
6. [git-secret](http://git-secret.io/)
7. [yarn](https://yarnpkg.com/en/)
8. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html)
9. TODO ruby (for fastlane)
10. TODO react-native requirements

## Overview

Directory layout:

```
.
├─── /.gitsecret                     # git-secret settings
├─── /build/                         # Everything to build backend and front-end
|    ├──────── /base-images/         # Public docker images extracted to speed-up build process
|    ├──────── /scripts/             # Scripts to automates common build tasks, git hooks
|    ├──────── /.env files           # Env variables for docker
|    └──────── /compose files        # Compose files for docker
├─── /legcay/                        # TO BE DELETED - sources of old web and mobile clients
├─── /docs/                          # Docs
├─── /packages/                      #
|    ├──────── /adminer/             # Adminer web ui for postgres
|    ├──────── /backend/             # node.js backend
|    ├──────── /caddy/               # reverse proxy
|    ├──────── /clients/             # code shared by web and mobile clients
|    ├──────── /commons/             # code shared by backend and clients
|    ├──────── /db/                  # postgres + postgis + timescale db
|    ├──────── /minio/               # object storage for uploads
|    ├──────── /mobile/              # react-native mobile client (TBD)
|    ├──────── /mongo-to-postgres/   # docker-compose stack to migrate from data old mongo databse to postgres 
|    ├──────── /web/                 # create-react-app-typescript web client
|    └──────── /workers/             # Service to harvest data from various gauge sources
├─── /docker-sync.yml                # docker-sync config for development environment
├─── /graphql.config.json            # Config for IDEA GRAPHQL plugin
└─── /package.json                   # global package json, for npm scripts
```

## Environments

Backend has 4 configurations:
1. **development** - Runs on local machine (docker 4 mac) with help of docker-sync. Live code reloading. 
  DB container is used for tests, which run locally
2. **local** - Runs in virtualbox local docker-machine. Local staging configuration, NODE_ENV = production. HTTP
3. **staging** - runs on remote docker-machine, `swapp.avatan.ru` NODE_ENV = production. HTTPS
4. **production** 

### General principles

Each docker container has access to some environment variables (some of them should be replaced with docker-secrets in future).
These env variables are stored in `.env.*` files in root of `packages/<container_service_name>` directories.
Some containers share some variables (e.g. postgres password). Shared variables are stored in `.env.*` files in `build` dir.

Env filenames follow this patter `.env.<environment_name>`. 
Each file can be accompanied by `.env.<environment>.local` file, which contains local overrides.  

`.env.<environment_name>` files **are encrypted** with `git secret` and secrets **are checked in** into git.
The files themselves are **.gitignored**
  
`env.<environment_name>.local` files are **.gitignored** and should be only used on developers machines for local overrides.
They should never be stored in git. 

### Shared variables

Only variables shared between containers are listed here.  
For container-specific env variables see packages READMEs

| Variable name               | Value examples (defaults) | Consumers                  | Description                        |
|-----------------------------|---------------------------|----------------------------|------------------------------------|
| POSTGRES_DB                 | wwguide                   | backend, workers, db       | Postgres database name |
| POSTGRES_PASSWORD           | ********                  | backend, workers, db       | Postgres password |
| MINIO_ACCESS_KEY            | <random_secret>           | backend, minio             | Minio access key |
| MINIO_SECRET_KEY            | <random_secret>           | backend, minio             | Minio secret key |
| MINIO_PROXY_PATH            | uploads                   | backend, caddy             | APP_DOMAIN path that will be proxied to minio by caddy |
| WORKERS_HOST                | workers                   | backend, workers           | Host name in docker network, or localhost for testing
| WORKERS_PORT                | 7080                      | backend, workers           | port on which workers container is listening (see workers README for more)
| WORKERS_ENDPOINT            | /endpoint                 | backend, workers           | endpoint on which workers container is listening (see workers README for more)

## Build process

Backend stack is built with Docker. Base compose file is `build/docker-compose.yml`.
For each environment configuration, additional override file is also used, e.g. `build/docker-compose.development.yml`.

~~Dev configuration is launched using `docker-sync`.~~

Staging configurations use docker swarm node (single host) and use `docker stack deploy`.
Deployed environemts also have one common `.yml` files, so the override order is `docker-compose.yml` > `docker-compose.deploy.yml` > `docker-compose.staging.yml`.  
They are managed via `docker-machine`. The machine names must be `ww-local` and `ww-staging`, scripts use these names.  
Private AWS container registry is used to publish docker images and then to pull them onto docker-machines.

Docker images for backend stack parts are tagged with configuration (`development`/`local`/`staging`) and version number from package.json.
Version numbers are automatically incremented in with a pair of git pre-commit and post-commit hooks.
Husky is installed in project root to ensure that hooks are properly set up after you check-out and npm install project.

## npm scripts

| Script             | Description                                           
|--------------------|-------------------------------------------------------
| dev:cleanup        | Stops dev containers, cleans up `docker-sync` stack. Pass `--hard` to delete all images, volumes, containers and start next build from scratch    
| dev:start          | Runs dev configuration using docker-sync              
| dev:images         | Downloads images from old backend to minio package, also compresses them to be included into minio docker image. Requires access to v1 docker-machine.             
| dev:migrate        | Downloads latest dump v1 mongo dump from s3, loads it into running postgres dev instance.             
| local:start        | creates, starts (if necessary) local machine, prepares all folders in host vm, uploads images. DOES NOT DEPLOY. 
| local:cleanup      | Stops docker stack and wipes filesystem on `ww-local` docker-machine
| local:prepare      | Prepares `ww-local` docker machine by creating necessary dirs. Should be run every time docker-machine starts              |
| local:publish      | Builds stack images, tags them as `local.<version>`, pushes them to AWS ECR. <br/> Pass `--container <xxx>` one or many times to rebuild only those containers.
| local:deploy       | Deploys updates to `ww-local` machine. <br/> Uses versions from `package.json`s. All images must be published beforehand.
| staging:publish    | Same as `local:publish`
| staging:deploy     | Same as `local:deploy`
| staging:cleanup    | Same as `local:cleanup`, but keeps caddy certificates dir
| staging:images     | Same as `local:images`
| staging:update     | Updates one particular service in stack (`docker service update --image`), uses version from `package.json`<br> pass package name via (mandatory) `--image` flag.
| wml:start          | Starts WML |

## Development

### Step by step guide

1. Checkout project from github
2. Install requirements
3. Run `dev:images`, or ask for images dump
4. Run `yarn` in project root and in packages `web`, `backend`, `clients`, `commons` to install npm dependencies
5. `git secret reveal` to show secrets, or create local .env files and develop with local env
6. Run `yarn run wml:start` to launch WML, see about WML below
7. Launch backend stack you want to develop client against with `yarn run dev:start` or `yarn run local:start` and then `yarn run local:deploy`

### WML

It is difficult to set up shared component between web and mobile clients, especially in typescript

See related discussion [here](https://github.com/facebookincubator/create-react-app/issues/1492)

I use [WML](https://github.com/wix/wml) here as least painful solution

### Local docker-machine

If you run no more than one docker-machine at a time, then ip is stable.  
Get this ip with `docker-machine ip ww-local` and add it to your hosts file as `ww-local.io`.  
Then in web and mobile packages set urls in `env.development.local` to point to `ww-local.io` as backend.  
This is required, as facebook auth needs stable callback url.  

It's recommended to get images dump via `dev:images`, or ask me for archive. `local:start` will copy images to docker-machine

## Deployment

Here are deployment steps:

1. Assuming that you don't have `docker-machine` yet. If you have, skip to step 3
2. Setup docker-machine. 
  - For local machine this can be done via `local:start` script. It will set up machine, swarm mode on it, directory structure for bind mounts and will also upload seed images.
  - For remote machine you have to manually set up docker-machine, see example of `docker-machine create` below, use `local:prepare` and compose file for reference directory structure.
3. If you already have running docker-machine, you can optionally reset it to black state using `<env>:reset` script.
4. Commit all unsaved changes.
5. Run `<env>:publish` script. To do so your AWS CLI must be configured to used credentials with publish permissions. What this script does under the hood:
  - Merges compose ymls files and performs env substitution in those files. 
  - Builds backend and web locally, to make sure that only latest artifacts are baked into images (TODO build on commit hook)
  - Build all images in compose file
  - Tags images with moving tag (e.g. `db:staging`) and version tag (e.g. `db:staging.0.0.3`), takes versions from `package.json` files
  - Logs in into AWS ECR (using credentials stored on machine outside this repo) and pushes both moving and versioned images.
6. If docker-machine is pristine, or you want to update stack configuration (i.e. bind mounts, env variables, etc.) then go to 7. If you want to update running stack with newer versions of images, go to 8
7. Run `<env>:deploy`. What it does:
  - Merges compose files (again)
  - Logs into AWS ECR using read-only credentials from secretly commited `.aws-ecr` file.
  - Connects to docker-machine in `docker-machine env` fashion
  - Prunes old ( > 72h) unused images on this machine
  - Deploys the stack using `docker stack deploy`
8. Run `<env>:update --image <image_name>` to update image version of service in stack.
  - Version number is read from `package.json`, therefore it must be published in advance
  - Logs into AWS ECR using read-only credentials from secretly commited `.aws-ecr` file.

## Remote staging machine (domain unknown)

```sh
docker-machine create -d generic \
  --engine-storage-driver overlay2 \
  --generic-ip-address <ip> \
  --generic-ssh-key $HOME/.ssh/docker_ww_beta_rsa \
  --generic-ssh-user dockeradmin \
  ww-staging
```

# Migrations

TBD, see `mongo-to-postgres` README for v1 db migration instructions, see `dev:images` npm script for images v1 migration
