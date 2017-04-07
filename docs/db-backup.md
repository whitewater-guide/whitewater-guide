# Database backup and restore

This document describes steps to backup production database and restore it locally. 
(TODO: describe production restore too)

## Prerequisites

Docker-machine for Digital Ocean docker droplet (whitewater.guide) must be configured on this machine.
This guide assumes that the name of docker-machine is `wwguide`

## Backup

This is manual procedure. TODO is to automate this process.

1. Open new shell and login into docker machine: `docker-machine ssh wwguide`
2. Run this to create mongodump in home folder 
    ```
    docker run --rm --link whitewater_mongo_1:mongo --net whitewater_whitewater_network -v $HOME:/backup mongo bash -c 'mongodump --db wwdb --out /backup --host mongo'
    ```
3. Compress it `tar czf wwdb.tar.gz wwdb/`
4. Remove folder `rm -rf wwdb/`
5. Download it `docker-machine scp wwguide:/root/wwdb.tar.gz ~/Temp`
6. Remove archive on docker machine
 
## Restore

1. Extract dump: `tar xzf ~/Temp/wwdb.tar.gz`
2. Make sure that meteor and its mongo are running
3. `mongorestore --host 127.0.0.1:3334 --db meteor --drop --dir ~/Temp/wwdb`
4. Done!