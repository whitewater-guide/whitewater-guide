# Migration from mongo to postgres

This package contains 4 npm scripts:
 - **build** - builds Go app that transfers data from mongo db to postgres
 - **mongo** - Spins up mongo container, used for local dev
 - **restore** - runs mongorestore in container, restores to local mongo (for local dev)
 - **migrate** - runs bunch of docker containers to migrate from mongo to postgres, this is the main script, see detail below
 
## Migration process

`yarn run migrate` will start 3 containers:
1. `mongo` container. The only purpose of this database is to be filled with mongorestore
2. `restore` conatiner downloads latest v1 backup from s3, then mongorestores it into `mongo` container.
   Then it just hangs infinitely.
   
   The downside is that restored backup from s3 can be 1-day old. Not a big deal, except for measurements.
   To use fresh data, these two containers should be replaced by pointing `mongo2pg` container to real mongo from v1
3. `mongo2pg` - this is Go app that extracts data from Mongo, transforms it and inserts into pg.
   Because compose will start all 3 containers at the same time, mongo might not be restored yet.
   
   `command: ["-watch", "/backup"]` makes this app wait until downloaded backup archive is deleted from
   shared `backup` volume. This indicated that `restore`'s job is done.
   
This compose file should be launched on the same docker-machine as destination postgres.
To interact with postgres, `mongo2pg` should be in the same network as postgres.
Make sure to use proper network at the end of compose. For local dev machine this would be `build_default`

Mongo and `restore` containers will hang infinitely, but `mongo2pg` will exit. 
Executing compose with `--abort-on-container-exit` flag ensures that when `mongo2pg` exits, other
two containers will exit too.

## Env variables

| Name               | Value                          | Consumer              | Description 
|--------------------|--------------------------------|-----------------------|-------------
| BACKUP_PATH        | "" (empty string)              | `restore` container   | Path in bucket where to look for backup archive. Should not start with `/`, default empty string means backup archive in bucket root
| BACKUP_NAME        | wwdb_latest.tar.gz             | `restore`, `mongo2pg` | Backup archive name  
| MONGO_URI          | mongodb://mongo:27017/wwdb     | `restore`, `mongo2pg` | [Mongo Connection String](https://docs.mongodb.com/manual/reference/connection-string/). E.g. `mongodb://localhost:27017/wwdb?ssl=false`
| MONGO_OPTIONS      | -v --drop --noIndexRestore     | `restore`             | Be verbose, ensure clean restore with `--drop`, make process faster with `--noIndexRestore`
| MONGO_DB           | wwdb                           | `restore`             | For some reason `--uri` alone is not enough, so this is mongo db name
| MONGORESTORE_WAIT  | true                           | `restore`             | If `true`, will use `--dryRun` first to wait until mongodb starts. Used to work with compose
| MONGORESTORE_HANG  | true                           | `restore`             | If `true` will sleep infinitely after restore process is complete
| AWS_ACCESS_KEY     |                                | `restore`             | AWS access key
| AWS_SECRET_KEY     |                                | `restore`             | AWS secret key
| S3_BUCKET          | mongodbbackup.whitewater.guide | `restore`             | AWS bucket name
| POSTGRES_HOST      | db                             | `mongo2pg`            | Postgres host (inside docker network)
| POSTGRES_DB        | wwguide                        | `mongo2pg`            | Db name
| PGPASSWORD         |                                | `mongo2pg`            | xz
| PGNETWORK          | build_default                  | docker-compose        | Set inline (see `package.json`) for compose file network variable substitution
| M2PG_MAX_AGE       | 0                              | `mongo2pg`            | Max measurement age in days, or 0 for all measurements
