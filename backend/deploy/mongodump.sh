#!/bin/bash
set -e

### Configuration ###

APP_DIR=/var/www/whitewater
RESTART_ARGS=
MONGO_URL=mongodb://localhost:27017/wwdb

# Uncomment and modify the following if you installed Passenger from tarball
#export PATH=/path-to-passenger/bin:$PATH


### Automation steps ###

set -x

cd $APP_DIR

mongodump --db wwdb
cd dump
tar -cvf ../wwdb.tar wwdb
rm -rf wwdb