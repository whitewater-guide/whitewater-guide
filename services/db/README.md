# Production image

This imaged is derived from `timescale/timescaledb-postgis` and contains just our custom configuration.
All the other files should be `.dockerignore`'d

# Development

In development environment database will start blank. However, it can be seeded with full database dump from production or staging.
To do this, two files, `config/dump.bak` and `config/x-development.sh` are mounted as docker volumes to development stack.

To produce dump file, use script `scripts/refresh_dump.sh`. This script has two parameters:

- pass `--env production` (default) or `--env staging` to get latest dump from corresponding docker-machine
- pass `--skip-measurements` to produce dump without measurements table, which will massively speed-up restore and reduce size
- unfortunately, `--skip-measurements` is a bit fucked up, so dev environment won't be able to insert into `measurements` table after such restoration. See [this issue](https://github.com/timescale/timescaledb/issues/1024)

`refresh_dump.sh` script will read env variables from secret `.env` file, which contains `S3_REGION` and `S3_BUCKET` variables to point it to correct AWS S3 backup bucket.
It'll use AWS credentials from dev machine, because I'm lazy to pass read-only credentials via same secret file

There are npm scripts that are shortcuts to `refresh_dump.sh`

**Important**: during development, db files are stored on named volume. So `postgres-initdb` and `x-development` restore will run only if volume is blank. If you want to refresh your dump, you have to remove the named volume and restart db container;
