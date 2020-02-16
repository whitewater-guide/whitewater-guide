# Migration

This documents describes procedure of upgrade from `timescale/timescaledb-postgis:1.4.1-pg10` to `timescale/timescaledb-postgis:1.6.0-pg11`

## 1. Add versioning to pg data dir

Postgres data used to be located in `/var/postgres/data` directory on host machine. Now it's located in `/var/postgres/10.9/data`

Steps to migrate:

- Power down machine
- Make snapshot
- Power up machine
- Rm stack
- Run commands:
  ```bash
  cd /var/postgres
  mkdir 10.9
  chown -R dockeradmin:docker 10.9
  mv data/ 10.9/
  ```
- Deploy stack again

## 2. Update postgres version

- Back up databse to s3
- Replace db's base image to `timescale/timescaledb-postgis:1.4.1-pg11` (timescale version is the same, postgres version is new)
- In compose file, replace pg version path
- Restore backup
