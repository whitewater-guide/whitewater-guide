#!/bin/bash
set -e

### Configuration ###

SERVER=root@138.68.66.238
APP_DIR=/var/www/whitewater

### Library ###

function run()
{
  echo "Running: $@"
  "$@"
}

echo
echo "---- Running deployment script on remote server ----"
run cat mongodump.sh | ssh $SERVER
run scp $SERVER:$APP_DIR/wwdb.tar ../.meteor/dump/wwdb.tar