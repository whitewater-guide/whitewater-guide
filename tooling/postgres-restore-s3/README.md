This image is based on https://github.com/schickling/dockerfiles/tree/master/postgres-restore-s3

This image and matching `postgres-backup-s3` has been modified to allow timescaledb restore

See info here: https://docs.timescale.com/v0.9/using-timescaledb/backup

Below is the original readme:

# postgres-restore-s3

Restore a SQL backup from S3 to PostgresSQL

## Warning

This will potentially put your database in a very bad state or complete destroy your data, be very careful.

## Limitations

This is made to restore a backup made from postgres-backup-s3, if you backup came from somewhere else please check your format.

- Your s3 bucket _must_ only contain backups which you wish to restore - it will always grabs the 'latest' based on unix sort with no filtering
- They must be gzip encoded text sql files
- If your bucket has more than a 1000 files the latest may not be restore, only one s3 ls command is made

## Usage

Docker:

```sh
$ docker run -e S3_ACCESS_KEY_ID=key -e S3_SECRET_ACCESS_KEY=secret -e S3_BUCKET=my-bucket -e S3_PREFIX=backup -e POSTGRES_DATABASE=dbname -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_HOST=localhost schickling/postgres-restore-s3
```
