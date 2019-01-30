# whitewater.guide

## Requirements

I work on this project only on Macs. Most likely, it'll work on Linux too (excpept for iOS app).
Most likely, it won't work on Windows because of various issues with symlinks, docker, git-secret, yarn and whatnot.

These things need to be installed:

- node.js 8.9+
  - prefer to install via `n`
  - `ln -s $(which node) /usr/local/bin/node` is recommended in case when you need to debug from xcode
- Latest docker for mac (tested with `Docker v18.09.1`, `docker-compose v1.23.2`, `docker-machine v0.16.1`)
- [watchman](https://facebook.github.io/watchman/)
- [git-secret](http://git-secret.io/)
- [yarn](https://yarnpkg.com/en/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html)
- Fastlane
  - It's recommended to install ruby with `rvm` ([guide](https://medium.com/@raymondctc/fastlane-with-rvm-on-macos-147446ce0f09))
- react-native requirements: [link](https://facebook.github.io/react-native/docs/getting-started)

## Overview

Directory layout:

```
.
├─── /.gitsecret                     # git-secret settings
├─── /config/                        # Config files and secrets required to deploy docker stack
├─── /dev-mount/                     # Directory where docker volumes are mounted during local development
|    ├──────── /db/                  #
|    └──────── /minio/               #
├─── /node_modules/                  # node_modules of root package
├─── /packages/                      # Top-level and shared projects that are not part of docker stack
|    ├──────── /clients/             # code shared by web and mobile clients
|    ├──────── /commons/             # code shared by backend and clients
|    └──────── /mobile/              # react-native mobile client
├─── /services/                      # servies that are part of docker stack. Dir names MUST match services name in compose file
|    ├──────── /adminer/             # Adminer web ui for postgres
|    ├──────── /backend/             # node.js backend
|    ├──────── /boompromo/           # create-react-app for promo code activation
|    ├──────── /caddy/               # reverse proxy
|    ├──────── /db/                  # postgres + postgis + timescale db
|    ├──────── /imagedump/           # cron task to backup images to s3
|    ├──────── /landing/             # static whitewater.guide landing page
|    ├──────── /pgdump/              # cron task to backup whole database to s3
|    ├──────── /web/                 # create-react-app web client (currently for admins and editors)
|    └──────── /workers/             # Service to harvest data from various gauge sources
├─── /tooling/                       # Auxiliary packages to automate build/deploy
|    ├──────── /postgres-backup-s3/  # public docker image for one-time db backups
|    ├──────── /postgres-restore-s3/ # public docker image for one-time db restores
|    └──────── /scripts/             # bash and node scripts to automate build/deploy/versioning/etc
├─── /.gitignore                     #
├─── /.huskyrc                       # husky config
├─── /.prettierignore                # prettier ignore list
├─── /.prettierrc.yml                # prettier config
├─── /README.md                      # this file
├─── /commitlint.config.js           # commitlint rules
├─── /graphql.config.json            # Config for IDEA GRAPHQL plugin
├─── /lerna.json                     # lerna config
├─── /package.json                   # root package.json with scripts and deps
├─── /tsconfig.json                  # Base tsconfig for all packages
├─── /tslint.json                    # Base tslint rules for all packages
└─── /yarn.lock                      #
```

## Environments

App stack has 4 configurations:

- **development** - Runs on local machine (docker 4 mac). Live code reloading.
  - NODE_ENV = development
  - protocol = HTTP
  - some containers (db, minio) are used for backend integration tests, which run locally
  - can run on any git branch
- **local** - Runs in virtualbox local docker-machine.
  - NODE_ENV = production.
  - protocol = HTTP
  - can run on any git branch
- **staging** - runs on remote docker-machine, `beta.whitewater.guide`
  - NODE_ENV = production.
  - protocol = HTTPS
  - can run on `dev` git branch
- **production** - runs on remote docker-machine, `whitewater.guide`
  - NODE_ENV = production.
  - protocol = HTTPS
  - can run on `master` git branch

### General principles

Each docker container has access to some environment variables (some of them should be replaced with docker-secrets in future).
These env variables are stored in `.env.*` files in root of `packages/<container_service_name>` directories.
Some containers share some variables (e.g. postgres password). Shared variables are stored in `.env.*` files in `build` dir.

Env filenames follow this patter `.env.<environment_name>`.

`.env.<environment_name>` files **are encrypted** with `git secret` and secrets **are checked in** into git.
The files themselves are **.gitignored**

### Shared variables

Only variables shared between containers are listed here.
For container-specific env variables see packages READMEs

| Variable name     | Value examples (defaults) | Consumers            | Description                                                                    |
| ----------------- | ------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| POSTGRES_DB       | wwguide                   | backend, workers, db | Postgres database name                                                         |
| POSTGRES_PASSWORD | **\*\*\*\***              | backend, workers, db | Postgres password                                                              |
| MINIO_ACCESS_KEY  | <random_secret>           | backend, minio       | Minio access key                                                               |
| MINIO_SECRET_KEY  | <random_secret>           | backend, minio       | Minio secret key                                                               |
| MINIO_PROXY_PATH  | uploads                   | backend, caddy       | APP_DOMAIN path that will be proxied to minio by caddy                         |
| WORKERS_HOST      | workers                   | backend, workers     | Host name in docker network, or localhost for testing                          |
| WORKERS_PORT      | 7080                      | backend, workers     | port on which workers container is listening (see workers README for more)     |
| WORKERS_ENDPOINT  | /endpoint                 | backend, workers     | endpoint on which workers container is listening (see workers README for more) |

## Build process

Backend stack is built with Docker. Base compose file is `config/docker-compose.yml`.
For each environment configuration, additional override files are also used:

- **development** = `build/docker-compose.yml` + `build/docker-compose.development.yml`
- **local** = `build/docker-compose.yml` + `build/docker-compose.deploy.yml` + `build/docker-compose.local.yml`
- **staging** = `build/docker-compose.yml` + `build/docker-compose.deploy.yml` + `build/docker-compose.staging.yml`
- **production** = `build/docker-compose.yml` + `build/docker-compose.deploy.yml` + `build/docker-compose.production.yml`
  Configs are then merged together using `docker-compose config` [command](https://docs.docker.com/compose/reference/config/).

All environments except `development` use docker swarm node (single host) and use `docker stack deploy`.
They are managed via `docker-machine`. The machine names must be `ww-local`/`ww-staging`/`ww-production`, scripts use these names.

Docker images for stack services are tagged with version numbers from package.json.
They are automatically built when `lerna publish` is run. This is done using `postpublish:global` in every service's package.json file.
`postpublish:global` is run on root-level `postpublish` hook. This is because simple `postpublish` hook won't run for private packages,
and `postversion` hook will fail to build correct images when some common dependencies are bumped together and are not on npm yet.
Private AWS container registry is used to publish docker images and then to pull them onto docker-machines.

## Git hooks

Husky is installed in project root to ensure that hooks are properly set up after you check-out and npm install project.

- `pre-commit` hooks runs prettier and hides secrets
- `commit-msg` hook ensures enforces [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/#specification)

## npm scripts

| Script            | Description                                                                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dev:cleanup       | Deletes all images, volumes, containers so next `dev:start` starts from blank state                                                                                                             |
| dev:start         | Runs dev environment using `docker-compose up`                                                                                                                                                  |
| dev:images        | Downloads images from production (default, to download from staging, pass `staging` argument), also compresses them, so they can be uploaded somewhere else. Requires access to docker-machine. |
| local:start       | creates, starts (if necessary) local machine, prepares all folders in host vm, uploads images. DOES NOT DEPLOY.                                                                                 |
| local:cleanup     | Stops docker stack and wipes filesystem on `ww-local` docker-machine                                                                                                                            |
| local:prepare     | Prepares `ww-local` docker machine by creating necessary dirs. Should be run every time docker-machine starts                                                                                   |
| local:deploy      | Deploys updates to `ww-local` machine. <br/> Uses versions from `package.json`s. All images must be published beforehand.                                                                       |
| staging:deploy    | Same as `local:deploy`                                                                                                                                                                          |
| staging:cleanup   | Same as `local:cleanup`, but keeps caddy certificates dir                                                                                                                                       |
| staging:images    | Uploads images from local dump to staging. Intermediate step to migarte images from production to staging.                                                                                      |
| staging:update    | Updates particular service in stack (uses `docker service update`), uses version from `package.json`<br> pass package names via (mandatory) `--service` flags.                                  |
| production:deploy | Same as `staging` but for `production` environment                                                                                                                                              |
| junk              | Recursively deletes various junk files like `.DS_store` that Mac creates                                                                                                                        |
| postpublish       | Lerna hook to work around postpublish hook for private packages, more details above                                                                                                             |

## Development

### Step by step guide

1. Checkout project from github
2. Install the requirements
3. Run `dev:images`, or ask for images dump
4. Run `yarn` in project root to install root dependencies
5. Run `yarn lerna bootstrap --force-local` to install all dependencies
6. `git secret reveal` to show secrets
7. Launch backend stack you want to develop client against with `yarn run dev:start` or `yarn run local:start` and then `yarn run local:deploy`

### Local docker-machine

If you run no more than one docker-machine at a time, then ip is stable.
Get this ip with `docker-machine ip ww-local` and add it to your hosts file as `ww-local.io`.
Then in web and mobile packages set urls in `env.development` to point to `ww-local.io` as backend.
This is required, as facebook auth needs stable callback url.

It's recommended to get images dump via `dev:images`, or ask me for archive. `local:start` will copy images to docker-machine

## Deployment

Here are deployment steps:

1. Assuming that you don't have `docker-machine` yet. If you have, skip to step 3
2. Setup docker-machine.
   - For local machine this can be done via `local:start` script. It will set up machine, swarm mode on it, directory structure for bind mounts and will also upload seed images.
   - For remote machine you have to manually set up docker-machine, see example of `docker-machine create` below, use `local:prepare` and compose file for reference directory structure.
3. If you already have running docker-machine, you can optionally reset it to black state using `<env>:cleanup` script.
4. Ensure that all images for all services are published. If they are not, on next step you should receive an error (I hope it's not broken). Use `yarn lerna publish --force-publish` to force publish.
5. If docker-machine is pristine, or you want to update stack configuration (i.e. bind mounts, env variables, etc.) then go to step **6**.
   If you want to update running stack with newer versions of images, go to step **7**
6. Run `<env>:deploy`. What it does:
   - Merges compose files (again)
   - Logs into AWS ECR using read-only credentials from secretly commited `.aws-ecr` file.
   - Connects to docker-machine in `docker-machine env` fashion
   - Prunes old ( > 72h) unused images on this machine
   - Deploys the stack using `docker stack deploy`
7. Run `<env>:update --service <service_name>` to update image version of service in stack.
   - Version number is read from `package.json`, therefore it must be published in advance
   - Logs into AWS ECR using read-only credentials from secretly commited `.aws-ecr` file.
   - **IMPORTANT**: if you change/add/remove docker env variables, this script won't pick up these changes. Use `env:deploy` (preferred) or run `docker service update --env-add ...` manually.

### tmp dir

Many containers have their tmp stuff mapped to folders inside `/tmp` dir. This folder gets cleared on host restart.
Put commands to recreate required dir structure inside `/etc/rc.local` file.
Example file is here in this repo: `config/rc.local`.

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

## From production to staging

### Step 1: database

ssh into docker machine and run

```
docker run -e S3_ACCESS_KEY_ID=xxx \
           -e S3_SECRET_ACCESS_KEY=xxxx \
           -e S3_BUCKET=backup.whitewater.guide \
           -e S3_PREFIX=production \
           -e S3_REGION=eu-central-1 \
           -e POSTGRES_DATABASE=wwguide \
           -e POSTGRES_USER=postgres \
           -e POSTGRES_PASSWORD=xxxx \
           -e POSTGRES_HOST=db \
           --network wwguide_default \
           doomsower/postgres-restore-s3:x
```

Notes on arguments:

- **S3_ACCESS_KEY_ID** and **S3_SECRET_ACCESS_KEY** must belong to a user who has aws read access ti backups. The access key for dumper has no read permissions.
- **S3_PREFIX** is **where from** the backup will be restored. When restoring at staging, set this to `production` (and vice versa)
- **--network wwguide_default** Network must be attachable, see stack yml file for that
- **doomsower/postgres-restore-s3:x** replace X with latest version

### Step 2: images

First, run `dev:images` to download images from production to local machine

Then run `staging:images` to upload images from local machine to staging machine
